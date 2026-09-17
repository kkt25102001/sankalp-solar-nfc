Add-Type -AssemblyName System.Drawing

$logoPath = "c:\Users\LENOVO\.gemini\antigravity-ide\scratch\sankalp-solar-nfc\assets\logo.png"

$fileStream = [System.IO.File]::OpenRead($logoPath)
$srcImg = [System.Drawing.Image]::FromStream($fileStream)

Write-Host ("Original Logo Width: " + $srcImg.Width + " Height: " + $srcImg.Height)

# The black border lines are at x = 0..10 and at the right edge
# Let's crop inside the clean white area
# Original is around 700x800. Let's inspect:
$leftOffset = [int]($srcImg.Width * 0.04)   # Skips the black border on the left
$rightOffset = [int]($srcImg.Width * 0.04)  # Skips the border on the right
$topOffset = [int]($srcImg.Height * 0.02)
$bottomOffset = [int]($srcImg.Height * 0.02)

$cropWidth = $srcImg.Width - ($leftOffset + $rightOffset)
$cropHeight = $srcImg.Height - ($topOffset + $bottomOffset)

$cropBmp = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight)
$graphics = [System.Drawing.Graphics]::FromImage($cropBmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle($leftOffset, $topOffset, $cropWidth, $cropHeight)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $cropWidth, $cropHeight)

$graphics.DrawImage($srcImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$srcImg.Dispose()
$fileStream.Close()
$fileStream.Dispose()

# Save to logo.png
$cropBmp.Save($logoPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$cropBmp.Dispose()

Write-Host "Logo borders successfully removed!"
