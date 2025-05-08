const apiKey = '42f6d9401b1e6d44dc98fc19bf31711d'; // Your OpenWeatherMap API key

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const weatherDiv = document.getElementById('weatherInfo');
  const forecastDiv = document.getElementById('forecast');
  const loader = document.getElementById('loader');
  const errorMsg = document.getElementById('errorMsg');

  weatherDiv.classList.add('hidden');
  forecastDiv.classList.add('hidden');
  errorMsg.textContent = '';
  loader.style.display = 'block';

  try {
   
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    const { name } = data;
    const { temp } = data.main;
    const { description, icon } = data.weather[0];

  
    setBackgroundByWeather(description);

    weatherDiv.innerHTML = `
      <h2>${name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
      <p><strong>${temp}°C</strong></p>
      <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
    `;
    weatherDiv.classList.remove('hidden');

   
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!forecastRes.ok) throw new Error("Forecast not found");

    const forecastData = await forecastRes.json();
    const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    forecastDiv.innerHTML = forecastList
      .slice(0, 5)
      .map(item => {
        const date = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        return `
          <div class="forecast-card">
            <p>${date}</p>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}" />
            <p>${Math.round(item.main.temp)}°C</p>
          </div>
        `;
      })
      .join('');
    forecastDiv.classList.remove('hidden');

  } catch (error) {
    errorMsg.textContent = error.message;
  } finally {
    loader.style.display = 'none';
  }
}

function setBackgroundByWeather(description) {
  const weather = description.toLowerCase();

  let imageUrl;

  if (weather.includes('cloud')) {
    imageUrl = 'https://images.unsplash.com/photo-1504615755583-2916b52192d7?auto=format&fit=crop&w=1920&q=80';
  } else if (weather.includes('rain')) {
    imageUrl = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1920&q=80';
  } else if (weather.includes('clear')) {
    imageUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80';
  } else if (weather.includes('storm') || weather.includes('thunder')) {
    imageUrl = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80';
  } else if (weather.includes('snow')) {
    imageUrl = 'https://images.unsplash.com/photo-1608889175184-e06e8a7f4f0c?auto=format&fit=crop&w=1920&q=80';
  } else {
    imageUrl = 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&w=1920&q=80';
  }

  document.body.style.backgroundImage = `url('${imageUrl}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center';
}