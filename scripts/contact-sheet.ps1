# Builds a labelled contact sheet from a folder of images (for visual review)
param(
  [Parameter(Mandatory = $true)][string]$Folder,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$Cols = 6,
  [int]$Cell = 300
)

Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Path $Folder -Filter *.jpg | Sort-Object Name
$rows = [int][Math]::Ceiling($files.Count / $Cols)
$w = $Cols * $Cell
$h = $rows * ($Cell + 24)

$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(16, 16, 18))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$font = New-Object System.Drawing.Font("Consolas", 11)
$brush = [System.Drawing.Brushes]::White

$i = 0
foreach ($f in $files) {
  $col = $i % $Cols
  $row = [int][Math]::Floor($i / $Cols)
  $x = $col * $Cell
  $y = $row * ($Cell + 24)
  try {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $side = [Math]::Min($img.Width, $img.Height)
    $sx = [int](($img.Width - $side) / 2)
    $sy = [int](($img.Height - $side) / 2)
    $src = [System.Drawing.Rectangle]::new($sx, $sy, $side, $side)
    $dst = [System.Drawing.Rectangle]::new($x, $y, $Cell - 4, $Cell - 4)
    $g.DrawImage($img, $dst, $src, [System.Drawing.GraphicsUnit]::Pixel)
    $img.Dispose()
  }
  catch {
    Write-Output ("DRAW ERROR {0}: {1}" -f $f.Name, $_.Exception.GetBaseException().Message)
  }
  $g.DrawString(("{0}={1}" -f $i, $f.BaseName), $font, $brush, $x, ($y + $Cell + 2))
  $i++
}

$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output ("Saved {0} cells to {1}" -f $files.Count, $Out)
