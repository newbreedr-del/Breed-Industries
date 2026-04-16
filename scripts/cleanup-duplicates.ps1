# PowerShell script to remove duplicate components
# Run this from the project root directory

Write-Host 'Cleaning up duplicate components...' -ForegroundColor Yellow

$componentsToDelete = @(
    'src/components/header.tsx',
    'src/components/footer.tsx',
    'src/components/hero.tsx',
    'src/components/services.tsx',
    'src/components/about.tsx',
    'src/components/packages.tsx',
    'src/components/package-builder.tsx',
    'src/components/contact.tsx',
    'src/components/team.tsx',
    'src/components/stats.tsx',
    'src/components/benefits.tsx',
    'src/components/cta.tsx',
    'src/components/client-gallery.tsx'
)

foreach ($file in $componentsToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Deleted: $file" -ForegroundColor Green
    } else {
        Write-Host "Not found: $file" -ForegroundColor Gray
    }
}

Write-Host 'Cleanup complete!' -ForegroundColor Green
Write-Host 'See DELETED_COMPONENTS.md for details' -ForegroundColor Cyan
