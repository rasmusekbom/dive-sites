param([string]$in,[string]$out,[int]$x,[int]$y,[int]$w,[int]$h)
Add-Type -AssemblyName System.Drawing
$src=[System.Drawing.Image]::FromFile($in)
$bmp=New-Object System.Drawing.Bitmap $w,$h
$g=[System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($src,(New-Object System.Drawing.Rectangle 0,0,$w,$h),(New-Object System.Drawing.Rectangle $x,$y,$w,$h),[System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save($out,[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose();$bmp.Dispose();$src.Dispose()
