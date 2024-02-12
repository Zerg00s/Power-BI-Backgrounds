
# This script is used to prepare SVG files for use in the project. 
# It replaces fill attributes with classes.
foreach ($file in Get-ChildItem -Path svg\ -Filter *.svg) {
    $content = Get-Content -Path $file.FullName
    $content = $content -replace 'fill="#2C4698"', 'class="primary"'
    $content = $content -replace 'fill="#E5432F"', 'class="secondary"'
    $content = $content -replace 'fill="#F6F6F6"', 'class="frame"'
    $content = $content -replace 'fill="#EEEDF5"', 'class="background"'
}
# save changes
Set-Content -Path $file.FullName -Value $content

# update the images.txt file with the list of svg files
Get-ChildItem -Path svg\ -Filter *.svg | ForEach-Object { $_.Name } | Set-Content -Path images.txt


