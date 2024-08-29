<script>
    import { carData } from '$lib/data/cars.js';
    import CarView from '$lib/components/CarView.svelte';

    import { fade } from 'svelte/transition';

    import { onMount } from 'svelte';

    import { FirebaseDB as database } from '$lib/firebase/firebase';
    import { ref, onValue, update } from 'firebase/database';

    const db = database;
    console.log(carData);

    let inventoryData = {};
    let inventoryList = [];
    function getInventory() {
      const inventoryRef = ref(db, 'inventory');
      onValue(inventoryRef, (snapshot) => {
        const data = snapshot.val();
        inventoryData = data;
        inventoryList = Object.values(data['vehicles']);
        inventoryList.forEach(car => {
          cars.push(car);
        });
        console.log('inventory', inventoryList);
        console.log('cars', cars);
        carsKey = {};
      });
    }

    let searchLabels = [];
    let searchValues = {};

    let omittedLabels = ['images', 'imageIndex', 'body_style_name', 
      'displayString', 'dealer_name', 'VIN', 'url', 'price', 'milage',
      'Trim Details', 'City', 'Stock', 
    ];

    let sortedLabels = ['make', 'model', 'year', 'Body Style', 'Transmission', 
      'Drivetrain', 'Exterior', 'Interior', 'Engine', 'Fuel type', 'trim'];
    function getSearchLabels(car) {
      let labels = new Set(searchLabels);
      let values = searchValues || {};


      
      for(let [key, value] of Object.entries(car)) {
        if(omittedLabels.includes(key)) {
          continue;
        }
        labels.add(key);
        if(values[key]) {
          values[key].add(value);
          values[key] = new Set(Array.from(values[key]).sort());
        }else {
          values[key] = new Set([value]);
        }
      }
      searchValues = values;
      searchLabels = Array.from(labels);

      searchValues = searchValues;
      searchLabels = searchLabels;

      return {searchLabels, searchValues};
    }

    let printThings = {};
    $: {
      if(inventoryList.length > 0) {
        for(let i = 0; i < inventoryList.length; i++) {
          let car = inventoryList[i];
          let searchLabels = getSearchLabels(car);
          printThings = getSearchLabels(inventoryList[0]); 
        }
      }
    }

    let carsKey = {};
    let cars = [];
    let contentDiv = null;
    let numCars = 10;

    /* add offline car data
    carData.forEach(car => {
        cars.push(car);
    });
    */


    // handle scroll
    let yScroll=0;
    let docWidth=0;
    let docBottom=0;

    let userInput = {
      name: '',
      phone: '',
      email: ''
    };

    $: outerWidth = 0;
    $: innerWidth = 0;

    let minWidth = 0;
    let multiplier = 1;
    $: {
      minWidth = innerWidth < outerWidth ? innerWidth : outerWidth;
      if(minWidth < 900) {
        multiplier = 2; 
      }else {
        multiplier = .8;
      }
      if(yScroll > numCars * 500 * multiplier) {
        numCars += 10;
      }
    }

    onMount(() => {
      // getInventory();

      // get labels from inventory
    });

    let headerDiv;

    // object to hold the selected car
    let selectedCar = {};

    $: {
      console.log(selectedCar);
    }

    let currentCars = [];
    let visibleCars = [];

    $: {
      visibleCars = cars.filter(car => {
        for(let [key, value] of Object.entries(selectedCar)) {
          if(value && car[key] !== value) {
            return false;
          }
        }
        return true;
      });

      visibleCars = visibleCars.slice(0, numCars);
      carsKey = {};
    }

    $: {
      if(Object.keys(selectedCar).length === 0) {
        for (let i = 0; i < searchLabels.length; i++) {
          selectedCar[searchLabels[i]] = '';
        }
      }
    }

    function handleSelect(event) {
      visibleCars = cars.filter(car => {
        for(let [key, value] of Object.entries(selectedCar)) {
          if(value && car[key] !== value) {
            return false;
          }
        }
        return true;
      });
      carsKey = {};
    }


</script>
    

<svelte:window bind:scrollY={yScroll} bind:outerWidth bind:innerWidth />

<body>
    <div class=container bind:this={headerDiv}>
      <a href='/'><button class=back>Back</button></a>
        <h1>Inventory</h1>
    </div>

    {#if yScroll > 100}
        <button class=returnToTop on:click={() => headerDiv.scrollIntoView({behavior: 'smooth'})}>Return to Top</button>
    {/if} 

    <div class=label-wrapper>
      <div class=container id='labels'>
          {#if searchLabels.length > 0}
            {#each sortedLabels as label}
              <select on:change={handleSelect} id={selectedCar[label]!== ''?'selected':''} bind:value={selectedCar[label]}>
                <option value="">{label}</option>
                {#each searchValues[label] as value}
                  <option value={value}>{value}</option>
                {/each}
              </select>
            {/each}
          {/if}
      </div>
    </div>
    <div class=container>
        <button class=clear on:click={()=>selectedCar={}}>Clear Filters</button>
    </div>

    <div class=content bind:this={contentDiv}>
      {#key carsKey}
        {#each visibleCars as car, index}
            <div class=wrapper>
                <CarView index={index} car={car} bind:input={userInput} />
            </div>
        {/each}
      {/key}
    </div>
</body>

<style>
  .clear {
    max-width: 20%;
  }
  .back{
  }
    h1 {
        text-align: center;
        font-size: 2em;
        margin: 0;
        padding: 20px;

  }
    body {
        min-height: 75vh;
    }

    .returnToTop {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 15px;
      font-size: 16px;
      cursor: pointer;
    }

    .container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100vw;
        min-width: 100vw;
        margin: 0;
        gap: 2px;
        padding: 20px;
        padding-left: 5.6%;
    }

    .label-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }


    #labels {
      justify-content: flex-start;
      gap: 10px;
    }

    select {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        text-align: center;
        gap: 2px;
        width: 18%; 
        text-transform: capitalize;

        /*styles*/
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        background-color: white;
        color: black;
        font-size: 16px;
        cursor: pointer;

        /*mobile styles*/
        @media only screen and (max-width: 900px) {
            width: 45%;
        }

    }

    #selected {
      background: #2A4139;
      color: white;
    }

    .content {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
        flex-wrap: wrap;
        gap: 20px;
        height: 100%;
        padding: 20px;
    }

    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 20px;
        width: 45%;
        padding: 20px;
        border-radius: 15px;
        background-color: azure;
        color: black;
        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .wrapper:hover {
        transform: scale(1.01);
        box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);
    }

  @media only screen and (max-width: 900px) {
    .wrapper {
        width: 100%;
    }

    .content {
        flex-direction: column;
    }
  }

</style>
