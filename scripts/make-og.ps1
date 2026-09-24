# Builds the Open Graph share image (1200x630) from a real MB TECHNIC photograph.
param(
  [string]$Photo = "public/media/opt/owner-03.jpg",
  [string]$Out = "public/og.jpg"
)

Add-Type -AssemblyName System.Drawing

$W = 1200; $H = 630
$img = [System.Drawing.Image]::FromFile((Resolve-Path $Photo))
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# cover-crop the photo
$scale = [Math]::Max($W / $img.Width, $H / $img.Height)
$dw = [int]($img.Width * $scale); $dh = [int]($img.Height * $scale)
$dx = [int](($W - $dw) / 2); $dy = [int]($H - $dh) * 0.35
$g.DrawImage($img, [System.Drawing.Rectangle]::new($dx, $dy, $dw, $dh))

# dark scrim: left-to-right + bottom
$scrim = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  [System.Drawing.Rectangle]::new(0, 0, $W, $H),
  [System.Drawing.Color]::FromArgb(248, 6, 7, 10),
  [System.Drawing.Color]::FromArgb(20, 6, 7, 10),
  [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal)
$g.FillRectangle($scrim, 0, 0, $W, $H)
$scrimB = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  [System.Drawing.Rectangle]::new(0, [int]($H * 0.4), $W, [int]($H * 0.6)),
  [System.Drawing.Color]::FromArgb(10, 6, 7, 10),
  [System.Drawing.Color]::FromArgb(230, 6, 7, 10),
  [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
$g.FillRectangle($scrimB, 0, [int]($H * 0.4), $W, [int]($H * 0.6))

$mono = New-Object System.Drawing.Font("Consolas", 15)
$big = New-Object System.Drawing.Font("Arial", 62, [System.Drawing.FontStyle]::Bold)
$mid = New-Object System.Drawing.Font("Arial", 24)
$white = [System.Drawing.Brushes]::White
$dim = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 210, 214, 219))
$accent = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 47, 98, 255))

$g.DrawString("MB TECHNIC  /  MERCEDES SPECIALIST", $mono, $accent, 72, 96)
$g.DrawString("СЕРВИС MERCEDES", $big, $white, 66, 148)
$g.DrawString("В АСТАНЕ", $big, $white, 66, 226)
$g.DrawString("Диагностика · двигатель · ходовая · кузов", $mid, $dim, 72, 340)
$g.DrawString("УЛИЦА АРКАЙЫМ, 7  ·  09:00-19:00  ·  5.0 В 2ГИС", $mono, $dim, 72, 470)

# accent rule
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 47, 98, 255), 3)
$g.DrawLine($pen, 72, 128, 220, 128)

$target = Join-Path (Get-Location).Path $Out
$bmp.Save($target, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose(); $bmp.Dispose(); $img.Dispose()
Write-Output ("og image written: {0}" -f $target)
