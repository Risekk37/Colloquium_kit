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
            const targetId = this.getAttribute('href');
            
            // Only prevent default action for internal links
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.getElementById(targetId.substring(1));
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

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
});
  const textElement = document.getElementById('text');
  const finalText = 'foreigners';
  const shuffleDuration = 1000; // Duration of the shuffle effect in milliseconds
  const intervalDuration = 100; // Duration of each shuffle step in milliseconds
  const shuffleSteps = shuffleDuration / intervalDuration;
  
  let currentStep = 0;
  
  function shuffleText() {
      let shuffledText = finalText
          .split('')
          .sort(() => 0.5 - Math.random())
          .join('');
  
      textElement.textContent = shuffledText;
      currentStep++;
  
      if (currentStep >= shuffleSteps) {
          clearInterval(shuffleInterval);
          textElement.textContent = finalText;
      }
  }
  const shuffleInterval = setInterval(shuffleText, intervalDuration);

  // Function to fade in text
function fadeInText(element) {
    element.style.opacity = 1;
}
// Select the text elements
const textElement1 = document.getElementById('text1');
// Set a timeout to trigger the fade-in effect
setTimeout(() => fadeInText(textElement1), 1000); // Fade in after 1 second