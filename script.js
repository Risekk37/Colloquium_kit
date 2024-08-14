window.onload = function() { 
    const url = 'Rental_Housing_Survey.xlsx';
  
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.arrayBuffer();
        })
        .then(arrayBuffer => {
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonSheet = XLSX.utils.sheet_to_json(sheet);
  
            const onlineLeaseCounts = {
                'O': 0,
                'X': 0
            };
            jsonSheet.forEach(row => {
                const lease = row['Online Lease'].toString().toUpperCase().replace('TRUE', 'O').replace('FALSE', 'X');
                if (onlineLeaseCounts[lease] !== undefined) {
                    onlineLeaseCounts[lease]++;
                }
            });
  
            const ctx = document.getElementById('myChart').getContext('2d');
            const total = onlineLeaseCounts['O'] + onlineLeaseCounts['X'];
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Online Lease (O)', 'Online Lease (X)'],
                    datasets: [{
                        data: [onlineLeaseCounts['O'], onlineLeaseCounts['X']],
                        backgroundColor: ['rgba(248, 0, 255, 0.8)', 'rgba(0, 255, 103, 0.8)'],
                        hoverBackgroundColor: ['rgba(248, 0, 255, 1)', 'rgba(0, 255, 103, 1)'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Online Lease Distribution',
                            color: '#ffffff',
                            font: {
                                size: 24
                            }
                        },
                        datalabels: {
                            color: '#ffffff',
                            formatter: (value, context) => {
                                const percentage = (value / total * 100).toFixed(0) + '%';
                                return context.chart.data.labels[context.dataIndex] + ' (' + percentage + ')';
                            },
                            anchor: 'center',
                            align: 'center',
                            offset: 0,
                            font: {
                                weight: 'bold',
                                size: 15
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
  
            const renderChart = (chartId, columns, titleText, colors) => {
                const percentages = columns.map(column => {
                    const total = jsonSheet.length;
                    const countO = jsonSheet.filter(row => row[column] && row[column].toString().toUpperCase() === 'O').length;
                    return (countO / total * 100).toFixed(2);
                });
  
                const ctx = document.getElementById(chartId).getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: columns,
                        datasets: [{
                            data: percentages,
                            backgroundColor: colors,
                            hoverBackgroundColor: colors,
                            barThickness: 80
                        }]
                    },
                    options: {
                        plugins: {
                            title: {
                                display: true,
                                text: titleText,
                                color: '#ffffff',
                                font: {
                                    size: 24
                                }
                            },
                            legend: {
                                display: false
                            },
                            datalabels: {
                                color: '#ffffff',
                                formatter: (value, context) => {
                                    const percentage = value + '%';
                                    return context.chart.data.labels[context.dataIndex] + ' (' + percentage + ')';
                                },
                                anchor: 'end',
                                align: 'top',
                                offset: 0,
                                font: {
                                    size: 18,
                                    weight: 'bold'
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                    display: true,
                                    text: 'Percentage (%)',
                                    color: '#ffffff',
                                    font: {
                                        size: 18
                                    }
                                },
                                ticks: {
                                    color: '#ffffff',
                                    font: {
                                        size: 18
                                    }
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#ffffff',
                                    font: {
                                        size: 18
                                    }
                                }
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            };
  
            renderChart('myBarChart1', [
                "House-specific info", "Photos of unit", "Floor plan of unit"
            ], 'Expectations detailed information', ['#FF6384', '#36A2EB', '#FFCE56']);
  
            renderChart('myBarChart2', ["Tour in person", "Virtual tour", "Video tour"],
                'The touring options renters are most interested in',
                ['#FF6384', '#36A2EB', '#FFCE56']);
  
            renderChart('myBarChart3', [
                "Rental search website", "Apartment community", "Search engine", "Social media",
                "Old fashion(Broker, Talking with people)"
            ], 'Which sources renters plan to use in their search',
                ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']);
  
            renderChart('myBarChart4', [
                "Price", "Safety considerations", "Location_school&work", "Location_friend&family", "Utilities(Park, Store)"
            ], 'Factors important to renters', ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']);
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
        });
  
    document.getElementById('pic1').addEventListener('click', () => handleImageClick('myChart', 'pic1'));
    document.getElementById('pic2').addEventListener('click', () => handleImageClick('myBarChart1', 'pic2'));
    document.getElementById('pic3').addEventListener('click', () => handleImageClick('myBarChart2', 'pic3'));
    document.getElementById('pic4').addEventListener('click', () => handleImageClick('myBarChart3', 'pic4'));
    document.getElementById('pic5').addEventListener('click', () => handleImageClick('myBarChart4', 'pic5'));
  };
  
  function handleImageClick(chartId, picId) {
    const chartContainer = document.querySelector('.chart-container');
    const imagesContainer = document.querySelector('.image-container_chart');
    const picElement = document.getElementById(picId);
  
    if (chartContainer.classList.contains('show') && document.getElementById(chartId).style.display === 'block') {
        hideCharts();
        return;
    }
  
    picElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        picElement.style.transform = 'scale(1)';
  
        document.querySelectorAll('.chart-container canvas').forEach(chartCanvas => {
            chartCanvas.style.display = 'none';
        });
  
        document.getElementById(chartId).style.display = 'block';
        chartContainer.classList.add('show');
  
        imagesContainer.classList.add('vertical');
        adjustChartHeightToFitImages(); // 이미지 높이에 맞추기 위해 함수 호출
    }, 200);
  }
  
  function hideCharts() {
    const chartContainer = document.querySelector('.chart-container');
    const imagesContainer = document.querySelector('.image-container_chart');
  
    chartContainer.classList.remove('show');
    imagesContainer.classList.remove('vertical');
  }
  
  function adjustChartHeightToFitImages() {
    const imageContainer = document.querySelector('.image-container_chart');
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.style.height = `${imageContainer.clientHeight}px`;
  }
  
  // TOC script
  document.addEventListener("DOMContentLoaded", function() {
    const tocLinks = document.querySelectorAll('.toc ul li a');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });
  
    const toc = document.querySelector('.toc');
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.toc a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === entry.target.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.7
        }
    );
  
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
  
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        const button = item.querySelector('.toggle-btn');
        const description = item.querySelector('.description');
  
        if (index === 0) {
            button.textContent = '-';
            description.style.display = 'block';
            document.getElementById('mainImage').src = item.getAttribute('data-image');
        }
  
        button.addEventListener('click', function() {
            const isActive = description.style.display === 'block';
            const allDescriptions = document.querySelectorAll('.description');
            const mainImage = document.getElementById('mainImage');
  
            allDescriptions.forEach(desc => desc.style.display = 'none');
            menuItems.forEach(menuItem => menuItem.querySelector('.toggle-btn').textContent = '+');
  
            if (!isActive) {
                description.style.display = 'block';
                button.textContent = '-';
                mainImage.src = item.getAttribute('data-image');
                description.textContent = item.getAttribute('data-description');
            }
        });
    });
  
    const mapContainerObserverConfig = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
  
    const mapContainerObserver = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startTypeEffect();
                self.unobserve(entry.target);
            }
        });
    }, mapContainerObserverConfig);
  
    mapContainerObserver.observe(document.querySelector('#map-container'));
  
    function typeEffect(element, text, delay = 0) {
        let i = 0;
        function typing() {
            if (i < text.length) {
                const char = text.charAt(i);
                if (char === "\n") {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += char;
                }
                i++;
                setTimeout(typing, delay);
            }
        }
        typing();
    }
  
    function startTypeEffect() {
        const overlayText = document.getElementById('overlay-text');
        const overlayTextLine = document.getElementById('overlay-text-line');
  
        const text1 = `How easy is it to find 
        a room for rent in NYC?`;
        const text2 = `Is it easy or difficult to rent a home in New York? 
        What challenges do newcomers face when they first arrive 
        in New York, and how does the rental system operate there?`;
  
        typeEffect(overlayText, text1, 20);
        setTimeout(() => {
            typeEffect(overlayTextLine, text2, 20);
        }, text1.length * 20 + 100);
    }
  });




  mapboxgl.accessToken = 'pk.eyJ1Ijoia2l0Mzc3NSIsImEiOiJjbHlsc3Z0bHowYmNmMmtvamZjeG1xYzJjIn0.6DjxqtbCSE9iiq1Xwd3YRw';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kit3775/clzqdgaop00bw01pb4cod5xnd',
    zoom: 11,
    minZoom: 10.8,
    maxZoom: 30.5,
    center: [-73.918285, 40.793091],
    pitch: 0,
    bearing: 0
});

// Add image to the map once on load
map.on('load', function () {
    map.loadImage(
        'Park-icon.png', // Make sure the path is correct
        function (error, image) {
            if (error) throw error;
            if (!map.hasImage('Park-icon')) {
                map.addImage('Park-icon', image);
            }
        }
    );
});

// Additional images...

// Function to load and add GeoJSON files to the map
function loadGeoJSON(url, name, type, color, width = 2, icon = null, iconSize = 1.0) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Add GeoJSON source
            map.addSource(name, {
                type: 'geojson',
                data: data
            });

            // Determine the layer type and properties based on input
            const layerProperties = {
                id: name,
                source: name
            };

            // Set the type of the layer based on the provided type
            if (type === 'polygon') {
                layerProperties.type = 'fill'; // Set layer type to 'fill'
                layerProperties.paint = {
                    'fill-color': color,
                    'fill-opacity': 0.6
                };
            } else if (type === 'line') {
                layerProperties.type = 'line'; // Set layer type to 'line'
                layerProperties.paint = {
                    'line-color': color,
                    'line-width': 4
                };
            } else if (type === 'line-dash') {
                layerProperties.type = 'line'; // Set layer type to 'line'
                layerProperties.paint = {
                    'line-color': color,
                    'line-width': 1,
                    'line-dasharray': [2,1.5]
                };    
            } else if (type === 'circle') {
                layerProperties.type = 'circle'; // Set layer type to 'circle'
                layerProperties.paint = {
                    'circle-color': color,
                    'circle-radius': 5
                };
            } else if (type === 'icon') {
                layerProperties.type = 'symbol'; // Set layer type to 'symbol'
                layerProperties.layout = {
                    'icon-image': icon, // Use the icon image
                    'icon-size': 0.04 // Adjust icon size
                };
            }

            // Add layer to map
            map.addLayer(layerProperties);
        });
}

// Function to remove all GeoJSON layers
function removeGeoJSONLayers() {
    const layerIds = map.getStyle().layers.map(layer => layer.id);
    layerIds.forEach(id => {
        if (id.startsWith('geojson-layer') || id.startsWith('geojson2-layer')) {
            map.removeLayer(id);
            map.removeSource(id);
        }
    });
}

// Load GeoJSON files with specific styles

// Function to show GeoJSON layers and zoom to the area
function showGeoJSON(prefix) {
    removeGeoJSONLayers();

    if (prefix === 'geojson') {
        // Red polygon
        loadGeoJSON('geojson/Bldg1/Bldg1.geojson', 'geojson-layer-1', 'polygon', '#FF0000');

        // Yellow lines
        loadGeoJSON('geojson/Bldg1/Walk5.geojson', 'geojson-layer-2', 'line-dash', '#7c6487');
        loadGeoJSON('geojson/Bldg1/Walk10.geojson', 'geojson-layer-3', 'line-dash', '#8c7198');
        loadGeoJSON('geojson/Bldg1/Walk15.geojson', 'geojson-layer-4', 'line-dash', '#9a7da7');
        loadGeoJSON('geojson/Bldg1/Walk20.geojson', 'geojson-layer-5', 'line-dash', '#aa8bb8');
        loadGeoJSON('geojson/Bldg1/Walk25.geojson', 'geojson-layer-6', 'line-dash', '#b997c8');
        loadGeoJSON('geojson/Bldg1/Park_route.geojson', 'geojson-layer-7', 'line', '#49795e');
        loadGeoJSON('geojson/Bldg1/Sub_route.geojson', 'geojson-layer-8', 'line', '#984e9f');
        loadGeoJSON('geojson/Bldg1/Bus_route.geojson', 'geojson-layer-9', 'line', '#4f898c');
        loadGeoJSON('geojson/Bldg1/Super_route.geojson', 'geojson-layer-10', 'line', '#9b7a3b');

        // Blue icons (with images)
        loadGeoJSON('geojson/Bldg1/Park.geojson', 'geojson-layer-12', 'icon', null, 2, 'Park-icon', 1.0);
        loadGeoJSON('geojson/Bldg1/Subway.geojson', 'geojson-layer-13', 'icon', null, 2, 'Sub-icon', 1.0);
        loadGeoJSON('geojson/Bldg1/Bus.geojson', 'geojson-layer-14', 'icon', null, 2, 'Bus-icon', 1.0);
        loadGeoJSON('geojson/Bldg1/Supermarket.geojson', 'geojson-layer-15', 'icon', null, 2, 'Super-icon', 1.0);

        // Zoom to the area
        map.fitBounds([
            [-74.04728500751165, 40.68392725596164],
            [-73.91058693746815, 40.87764590622033]
        ], {
            padding: {top: 50, bottom: 50, left: 50, right: 50}
        });
    } else if (prefix === 'geojson2') {
        // Green polygon
        loadGeoJSON('geojson2/Bldg2/Bldg2.geojson', 'geojson-layer-1', 'polygon', '#00FF00');

        // Yellow lines
        loadGeoJSON('geojson2/Bldg2/Walk5.geojson', 'geojson-layer-2', 'line-dash', '#7c6487');
        loadGeoJSON('geojson2/Bldg2/Walk10.geojson', 'geojson-layer-3', 'line-dash', '#8c7198');
        loadGeoJSON('geojson2/Bldg2/Walk15.geojson', 'geojson-layer-4', 'line-dash', '#9a7da7');
        loadGeoJSON('geojson2/Bldg2/Walk20.geojson', 'geojson-layer-5', 'line-dash', '#aa8bb8');
        loadGeoJSON('geojson2/Bldg2/Walk25.geojson', 'geojson-layer-6', 'line-dash', '#b997c8');
        loadGeoJSON('geojson2/Bldg2/Park_route.geojson', 'geojson-layer-7', 'line', '#49795e');
        loadGeoJSON('geojson2/Bldg2/Sub_route.geojson', 'geojson-layer-8', 'line', '#984e9f');
        loadGeoJSON('geojson2/Bldg2/Bus_route.geojson', 'geojson-layer-9', 'line', '#4f898c');
        loadGeoJSON('geojson2/Bldg2/Super_route.geojson', 'geojson-layer-10', 'line', '#9b7a3b');

        // Blue icons (with images)
        loadGeoJSON('geojson2/Bldg2/Park.geojson', 'geojson-layer-12', 'icon', null, 2, 'Park-icon', 1.0);
        loadGeoJSON('geojson2/Bldg2/Subway.geojson', 'geojson-layer-13', 'icon', null, 2, 'Sub-icon', 1.0);
        loadGeoJSON('geojson2/Bldg2/Bus.geojson', 'geojson-layer-14', 'icon', null, 2, 'Bus-icon', 1.0);
        loadGeoJSON('geojson2/Bldg2/Supermarket.geojson', 'geojson-layer-15', 'icon', null, 2, 'Super-icon', 1.0);

        // Zoom to the area
        map.fitBounds([
            [-74.04728500751165, 40.68392725596164],
            [-73.91058693746815, 40.87764590622033]
        ], {
            padding: {top: 50, bottom: 50, left: 50, right: 50}
        });
    }
}

// Event listeners for buttons
document.getElementById('geojson1-btn').addEventListener('click', function () {
    showGeoJSON('geojson');
    document.getElementById('image1').src = 'Street1.jpg';
    document.getElementById('image2').src = 'Street1-2.jpg';
    document.getElementById('image3').src = 'Street1-3.jpg';
});

document.getElementById('geojson2-btn').addEventListener('click', function () {
    showGeoJSON('geojson2');
    document.getElementById('image1').src = 'Street2.jpg';
    document.getElementById('image2').src = 'Street2-2.jpg';
    document.getElementById('image3').src = 'Street2-3.jpg';
});