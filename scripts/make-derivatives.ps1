# Produces optimised, watermark-free derivatives of the real MB TECHNIC photos.
#  - crops the bottom band carrying the 2GIS CDN watermark
#  - caps width at 1400px, JPEG q84 (fast LCP, no oversized payloads)
param(
  [string]$Src = "public/media/gallery",
  [string]$Dst = "public/media/opt",
  [int]$MaxWidth = 1400,
  [int]$Quality = 84,
  [double]$CropBottomPct = 7.0
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $Dst)) { New-Item -ItemType Directory -Path $Dst -Force | Out-Null }

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)

foreach ($f in Get-ChildItem -Path $Src -Filter *.jpg) {
  try {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $cropH = [int]($img.Height * (1 - ($CropBottomPct / 100.0)))
    $scale = [Math]::Min(1.0, $MaxWidth / $img.Width)
    $outW = [int]($img.Width * $scale)
    $outH = [int]($cropH * $scale)

    $bmp = New-Object System.Drawing.Bitmap($outW, $outH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($img, [System.Drawing.Rectangle]::new(0, 0, $outW, $outH), [System.Drawing.Rectangle]::new(0, 0, $img.Width, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $target = Join-Path $Dst ($f.BaseName + ".jpg")
    $bmp.Save($target, $codec, $params)
    $kb = [Math]::Round((Get-Item $target).Length / 1KB)
    Write-Output ("{0,-20} {1}x{2}  {3}kb" -f $f.BaseName, $outW, $outH, $kb)
    $bmp.Dispose(); $img.Dispose()
  }
  catch {
    Write-Output ("FAIL {0}: {1}" -f $f.Name, $_.Exception.GetBaseException().Message)
  }
}
