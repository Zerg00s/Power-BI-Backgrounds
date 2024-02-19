function loadSvgFile(filePath) {
    fetch("svg/" + filePath)
        .then(response => response.text())
        .then(svgContent => {
            document.getElementById('svgContainer').innerHTML = svgContent;
            applyColors(); // Apply the colors to the new image
        })
        .catch(error => {
            console.error('Error fetching SVG file:', error);
        });
}

fetch('images.txt')
    .then(response => response.text())
    .then(text => {
        var images = text.split('\n').filter(image => image.trim() !== ''); // Filter out empty rows
        var imageGrid = document.getElementById('image-grid');
        var row = document.createElement('div');
        row.className = 'row';
        imageGrid.appendChild(row);

        images.forEach((image, index) => {
            // Fetch each SVG file directly
            fetch(`svg/${image}`)
                .then(response => response.text())
                .then(svgContent => {
                    var imgContainer = document.createElement('div');
                    imgContainer.className = 'svg-preview col-sm-6 col-md-4 col-lg-2'; // Adjust the column size as needed
                    imgContainer.innerHTML = svgContent; // Set the SVG content directly

                    // Optional: Add a class or ID to the SVG for styling or manipulation
                    var svgElement = imgContainer.querySelector('svg');
                    if (svgElement) {
                        svgElement.classList.add('img-fluid');
                        svgElement.style.cursor = 'pointer';
                        svgElement.onclick = () => {
                            // add class to the clicked svg
                            svgElement.classList.add('selected');
                            // remove class from the other svgs
                            let svgs = document.querySelectorAll('.svg-preview svg');
                            svgs.forEach(svg => {
                                if (svg !== svgElement) {
                                    svg.classList.remove('selected');
                                }
                            });
                            let svgContainer =  document.getElementById('svgContainer');
                            svgContainer.innerHTML = svgContent;
                            // inject style tag as a first child inside svg if does not exist
                            let svg = svgContainer.querySelector('svg');
                            if (!svg.querySelector('style')) {
                                console.log('style tag does not exist');

                                var styleTag = document.createElement('style');
                                styleTag.innerHTML = `
                                   
                                `;
                                svg.insertBefore(styleTag, svg.firstChild);

                            }
                            applyColors(); // Reapply colors to the new SVG
                        };
                    }

                    row.appendChild(imgContainer);

                    // Call loadSvgFile against the first image
                    if (index === 0) {
                        loadSvgFile(image);
                    }
                })
                .catch(error => {
                    console.error('Error fetching SVG:', error);
                });
        });
    })
    .catch(error => {
        console.error('Error fetching images list:', error);
    });

    // loadSvgFile('styles.svg');


    let applyColors = () => {
        var primaryColor = document.getElementById('primary-color').value;
        var secondaryColor = document.getElementById('secondary-color').value;
        var backgroundColor = document.getElementById('background-color').value;
        var frameColor = document.getElementById('frame-color').value;
    
        // Define a global style for SVG color customization
        var svgStyleContent = `
            svg .primary { fill: ${primaryColor}; }
            svg .secondary { fill: ${secondaryColor}; }
            svg .background { fill: ${backgroundColor}; }
            svg .frame { fill: ${frameColor}; }
        `;
    
        // Get all the <style> tags on the page
        var styleTags = document.getElementsByTagName('style');
    
        // Apply the svgStyleContent to each <style> tag
        for (var i = 0; i < styleTags.length; i++) {
            styleTags[i].innerHTML = svgStyleContent;
        }
    };
    

applyColors();

document.getElementById('primary-color').addEventListener('input', applyColors);
document.getElementById('secondary-color').addEventListener('input', applyColors);
document.getElementById('background-color').addEventListener('input', applyColors);
document.getElementById('frame-color').addEventListener('input', applyColors);


document.getElementById('download-svg').addEventListener('click', function () {
    var svg = document.getElementById('svgContainer').innerHTML;
    var blob = new Blob([svg], {
        type: 'image/svg+xml'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Power BI Background.svg'; // The file name for the downloaded SVG
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
});