// Add map error handling [[1]][[3]][[6]]
function initMap() {
    const mapElement = document.getElementById('flood-map');
    
    if (!mapElement) {
        console.error('Map container not found [[1]]');
        return;
    }

    mapElement.classList.remove('loading');
    
    // Add API key validation check [[4]][[5]]
    if (!window.google || !window.google.maps) {
        console.error('Google Maps API not loaded. Check API key and enabled APIs [[5]]');
        return;
    }

    const lowerAtis = { lat: 14.7125, lng: 121.0855 };
    
    try {
        const map = new google.maps.Map(mapElement, {
            zoom: 16,
            center: lowerAtis,
            mapTypeId: 'hybrid',
            styles: [
                { elementType: 'labels', stylers: [{ visibility: 'off' }] },
                {
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#3498db' }]
                }
            ]
        });

        // Add flood area polygon with error handling [[9]]
        try {
            new google.maps.Polygon({
                paths: [
                    { lat: 14.7128, lng: 121.0852 },
                    { lat: 14.7123, lng: 121.0858 },
                    { lat: 14.7119, lng: 121.0855 },
                    { lat: 14.7124, lng: 121.0849 }
                ],
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map
            });
        } catch (polygonError) {
            console.error('Polygon creation failed:', polygonError);
        }

        // Add markers with validation [[2]]
        const markers = [
            {
                position: { lat: 14.7130, lng: 121.0860 },
                title: 'Barangay Hall',
                icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            },
            {
                position: { lat: 14.7115, lng: 121.0850 },
                title: 'Evacuation Center',
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }
        ];

        markers.forEach(marker => {
            try {
                new google.maps.Marker({ ...marker, map });
            } catch (markerError) {
                console.error('Marker creation failed:', markerError);
            }
        });

    } catch (mapError) {
        console.error('Map initialization failed:', mapError);
        document.getElementById('flood-map').innerHTML = 
            '<div class="map-error">Map failed to load. Check console for errors [[8]]</div>';
    }
}

// Add API load timeout [[6]][[10]]
document.addEventListener('DOMContentLoaded', () => {
    const apiCheck = setInterval(() => {
        if (window.google && window.google.maps) {
            clearInterval(apiCheck);
            return;
        }
        
        if (performance.now() > 10000) { // 10s timeout
            clearInterval(apiCheck);
            document.getElementById('flood-map').innerHTML = 
                '<div class="map-error">Google Maps API failed to load. Check network connection [[6]]</div>';
        }
    }, 1000);
});

document.addEventListener('DOMContentLoaded', () => {
  const checkInterval = setInterval(() => {
    if (window.google && window.google.maps) {
      clearInterval(checkInterval);
      initMap(); // Initialize map once API is loaded
    } else if (performance.now() > 10000) { // 10s timeout
      clearInterval(checkInterval);
      document.getElementById('flood-map').innerHTML = 
        '<div class="error">Failed to load map. Check your API key and network connection [[6]][[10]].</div>';
    }
  }, 500);
});