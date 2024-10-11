document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('imageInput');
  const loader = document.getElementById('loader');
  const jsonOutput = document.getElementById('jsonOutput');

  if (fileInput.files.length === 0) {
    alert('Please select an image.');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadstart = function () {
    jsonOutput.innerHTML = '';
  };

  reader.onload = async function () {
    const base64Image = 'data:image/jpeg;base64,' + reader.result.split(',')[1];

    // Simulate metadata
    const imei = '123456789012345';
    const retryCount = 2;
    const imageName = 'Front_' + file.name;

    // Construct the JSON object
    const obj = {
      content: base64Image,
      imei: imei,
      name: imageName,
      retryCount: retryCount
    };

    // Pretty print the stringified JSON on the screen
    const jsonString = JSON.stringify(obj, null, 2);
    jsonOutput.innerHTML = `<pre>${jsonString}</pre>`;

    // Show loader before making the POST request

    // Send the POST request to the backend server using fetch
    try {
    loader.classList.remove('hidden');
      const response = await fetch('http://44.206.247.181:8282/retailcdcclient/sendImageForADMPrediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Display the server response in a more readable format
      jsonOutput.innerHTML += `<pre>Server Response: ${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
      jsonOutput.innerHTML += `<pre>Error: ${error.message}</pre>`;
    } finally {
      // Hide the loader after the request completes or fails
      loader.classList.add('hidden');
    }
  };


  reader.onerror = function () {
    alert('Failed to read file.');
  };

  // Read the file as a data URL (base64)
  reader.readAsDataURL(file);
});

