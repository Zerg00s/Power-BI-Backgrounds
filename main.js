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
        const images = text.split('\n').filter(image => image.trim() !== '');
        const fetchPromises = images.map(image =>
            fetch(`svg/${image}`).then(response => response.text())
        );

        Promise.all(fetchPromises)
            .then(svgContents => {
                var imageGrid = document.getElementById('image-grid');
                var row = document.createElement('div');
                row.className = 'row';
                imageGrid.appendChild(row);

                svgContents.forEach((svgContent, index) => {
                    var imgContainer = document.createElement('div');
                    imgContainer.className = 'svg-preview col-sm-6 col-md-5 col-lg-4';
                    imgContainer.innerHTML = svgContent;

                    var svgElement = imgContainer.querySelector('svg');
                    if (svgElement) {
                        svgElement.classList.add('img-fluid', 'pointer');
                        svgElement.onclick = () => {
                            svgElement.classList.add('selected');
                            let svgs = document.querySelectorAll('.svg-preview svg');
                            svgs.forEach(svg => {
                                if (svg !== svgElement) svg.classList.remove('selected');
                            });
                            let svgContainer = document.getElementById('svgContainer');
                            svgContainer.innerHTML = svgContent;

                            let svg = svgContainer.querySelector('svg');
                            if (!svg.querySelector('style')) {
                                var styleTag = document.createElement('style');
                                styleTag.innerHTML = ``; // Add necessary CSS here
                                svg.insertBefore(styleTag, svg.firstChild);
                            }

                            applyColors(); // Call a function to reapply colors or perform other tasks
                        };
                    }

                    row.appendChild(imgContainer);

                    if (index === 0) {
                        loadSvgFile(images[index]); // Assuming loadSvgFile is a defined function
                    }
                });
            })
            .catch(error => {
                console.error('Error processing SVGs:', error);
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
            svg .primary-stroke { stroke: ${primaryColor}; }
            svg .secondary-stroke { stroke: ${secondaryColor}; }
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