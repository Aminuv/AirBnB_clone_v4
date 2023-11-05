$(() => {
  /* vars and  elements */
  const selectedAmenities = $('.amenities h4');
  const selectedLocations = $('.locations h4');
  let checkedBoxes = [];

  /*  style */
  const h4Style = {
    'text-wrap': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    width: '212px',
    height: '16px'
  };
  selectedAmenities.css(h4Style);
  selectedLocations.css(h4Style);

  /*  change event listener for checkboxes */
  $("input[type='checkbox']").change(function () {
    if (this.checked) {
      checkedBoxes.push({
        id: this.dataset.id,
        name: this.dataset.name,
        type: this.dataset.type
      });
    } else {
      checkedBoxes = checkedBoxes.filter((item) => item.id !== this.dataset.id);
    }
    selectedAmenities
      .text(checkedBoxes
        .filter(item => item.type === 'amenity')
        .map(amenity => amenity.name)
        .join(', ')
      );
    selectedLocations
      .text(checkedBoxes
        .filter(item => item.type !== 'amenity')
        .map(location => location.name)
        .join(', ')
      );
  });

  /*  get API status */
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, status) {
    if (status === 'success') {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });

  /*  get all places  */
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: '{}',
    success: function (data) { renderPlaces(data); },
    contentType: 'application/json'
  });

  /*  filter placesc  */
  $('button').click(function () {
    const data = {
      amenities: [],
      states: [],
      cities: []
    };
    $('input[type="checkbox"]').each(function () {
      if (this.checked) {
        if (this.dataset.type === 'amenity') {
          data.amenities.push(this.dataset.id);
        } else if (this.dataset.type === 'state') {
          data.states.push(this.dataset.id);
        } else if (this.dataset.type === 'city') {
          data.cities.push(this.dataset.id);
        }
      }
    });

    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify(data),
      success: function (data) { renderPlaces(data); },
      contentType: 'application/json'
    });
  });
});

function renderPlaces (places) {
  $('section.places').html('');
  places.forEach(place => {
    $('section.places').append(`<article><div class="title_box"><h2>${place.name}</h2><div class="price_by_night">$${place.price_by_night}</div></div><div class="information"><div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div><div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div><div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div></div><div class="description">${place.description}</div></article>`);
  });
}
