Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\LENOVO\.gemini\antigravity-ide\scratch\sankalp-solar-nfc\assets\banner.jpg"
$destPath = "c:\Users\LENOVO\.gemini\antigravity-ide\scratch\sankalp-solar-nfc\assets\bottle.png"

$fileStream = [System.IO.File]::OpenRead($srcPath)
$srcImg = [System.Drawing.Image]::FromStream($fileStream)

Write-Host ("Image Width: " + $srcImg.Width + " Height: " + $srcImg.Height)

# Precise coordinates for RAYVOLT bottle & splash without bleeding
$x = 0
$y = 256
$w = 310
$h = 612

$cropBmp = New-Object System.Drawing.Bitmap($w, $h)
$graphics = [System.Drawing.Graphics]::FromImage($cropBmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)

$graphics.DrawImage($srcImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$cropBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$cropBmp.Dispose()
$srcImg.Dispose()
$fileStream.Close()
$fileStream.Dispose()

Write-Host "RAYVOLT Bottle perfectly re-cropped!"
