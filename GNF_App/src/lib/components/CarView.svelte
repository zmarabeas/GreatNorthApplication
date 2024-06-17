<script>
    import { carData } from '$lib/data/cars.js';
    import { createEventDispatcher } from 'svelte';
    import { slide } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    export let index;
    export let car;
    export let showDetails = false;
    import BIBinput from '$lib/components/BIBinput.svelte';

    import { FirebaseDB as database } from '$lib/firebase/firebase';
    import { ref, push } from "firebase/database";
    
    const db = database;

    let imageIndex = 0;
    let interestForm = false;

    const dispatch = createEventDispatcher();

    function formatPrice(price) {
        return price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    }

    function toggleDetails(button=false) {
        showDetails = !showDetails;
        dispatch('toggle', {showDetails, index});
    }
    export let input = {
        name: '',
        phone: '',
        email: ''
    };
    let testImages = [];
    let currentImage = '';
    let previousImage = '';
    let nextImage = '';
    let carImage = null;
    function handleImage(car, direction) {
      if (direction === 'prev') {
        if (imageIndex > 0) {
            imageIndex--;
        } else {
            imageIndex = car.images.length - 1;
        }
        carImage.src = car.images[imageIndex];
        console.log(carImage);
      } else if (direction === 'next') {
          if (imageIndex < car.images.length - 1) {
              imageIndex++;
          } else {
              imageIndex = 0;
          }
          carImage.src = car.images[imageIndex];
      }
    }

//price: 54995
//year: 2024
//make: Mitsubishi
//model: Outlander PHEV
//body_style_name: SUV
//trim: SEL
//dealer_name: Cranbrook
//milage: 1,438
//images: ['https://images.edealer.ca/2/131314582.jpeg', 'https://images.edealer.ca/2/131314587.jpeg', 'https://images.edealer.ca/2/131314584.jpeg', 'https://images.edealer.ca/2/131314575.jpeg', 'https://images.edealer.ca/2/131314580.jpeg', 'https://images.edealer.ca/2/131314574.jpeg', 'https://images.edealer.ca/2/131314573.jpeg', 'https://images.edealer.ca/2/131314576.jpeg', 'https://images.edealer.ca/2/131314577.jpeg', 'https://images.edealer.ca/2/131314586.jpeg', 'https://images.edealer.ca/2/131314585.jpeg', 'https://images.edealer.ca/2/131314589.jpeg', 'https://images.edealer.ca/2/131314579.jpeg', 'https://images.edealer.ca/2/131314578.jpeg']
//Body Style: SUV
//Engine: 2.4L 4cyl
//Exterior: Grey
//Interior: Grey
//Fuel type: Hybrid
//Transmission: Automatic
//Drivetrain: 4x4
//Stock: 24T4358A
//VIN: JA4T5VA91RZ602014
//City: Cranbrook
//url: https://www.kochgroup.ca/used/vehicle/2024-mitsubishi-outlander-phev-sel-id12851631.htm
//display_string: 2024 Mitsubishi Outlander PHEV SEL

    let nonDisplay = ['url', 'display_string', 'images', 'body_style_name',
      'details', 'image', 'VIN', 'Dealer Name', 'Stock', 'City', 'dealer_name'];

    onMount(() => {
    });

    let required = false;
    let success = false;
    function submitForm() {
        if(success) {
            return;
        }
        
        input['car'] = car;
        input['url'] = car.url || 'url not found';
        input['date'] = new Date();
        input['type'] = 'inventory';
        input['status'] = 'new';

        if(input.name === '' || (input.phone === '' && input.email === '')) {
            required = true;
            return;
        }

        required = false;
        success = true;
        console.log(input);
        push(ref(db, 'applications', ), {
                ...input
        });
    }

    $: {
        if (input.phone !== '' || input.email !== '') {
            required = false;
        }
        if (!interestForm) {
            success = false;
        }
      }
</script>


<div class=content>
    <div class=car-image>
      {#if car.images && car.images.length > 0}
          <div class=img-wrapper>
            <img bind:this={carImage} src={car.images[0]} alt="Car-Image" fetchPriority='high'/>
          </div>
          <div class=button-wrapper>
            <button style='width: 30%' on:click={()=>handleImage(car, 'prev')}>Previous</button>
            <span style='min-width: 20%; text-align:center;'>{imageIndex + 1} of {car.images.length}</span>
            <button style='width: 30%'on:click={()=>handleImage(car, 'next')}>Next</button>
          </div>
      {/if}
    </div>
    <div class='main-info'>
        {#if car.display_string}
          <h3>{car.display_string}</h3>
        {:else}
          <h3>{car.make} {car.model} {car.year}</h3>
        {/if}
        <span id=title-info>{car.mileage || car.milage} km</span>
    </div>
    <div class=row-container>
        <div class=price>
            <span>{formatPrice(car.price)}</span>
        </div>
      <button class=but id=head on:click={()=>interestForm=!interestForm}>Contact Us</button>
    </div>
<!--    
<img src={car.images[imageIndex]} alt="">

-->

<!--
    {#if showDetails}
        <div class=details in:slide={{duration: 1000}} out:slide={{duration: 1000}}>
            {#each car.details as detail}
                <p>
                    {detail}
                </p>
            {/each}
        </div>
    {/if}
-->
    {#if interestForm}
        <div class=interest-form in:slide={{duration: 400}} out:slide={{duration: 400}}>
            <BIBinput width={100} type={'text'} placeholder={"First and Last Name"} label={"Name"} bind:value={input.name}/>
            <BIBinput width={100} max=10 type={'phone'} placeholder={"123-456-7890"} label={"Phone"} bind:value={input.phone}/>
            <BIBinput width={100} type={'text'} placeholder={"EpicDeals@gnsf.com"} label={"E-Mail"} bind:value={input.email}/>
            <div class=text-wrapper>
              <textarea name="paragraph_text" cols="50" rows="10"
              placeholder="Leave us a comment!" bind:value={input.message}></textarea>
            </div>
            <button class=submit on:click={()=>submitForm()}>Submit</button>
            {#if required}
                <p style="color: red;">A phone number or email is required</p>
            {/if}
            {#if success}
                <p style="color: green;">Thank you! We will reach out to you shortly.</p>
            {/if}
        </div>
    {/if}
    <!--
      <div class=details in:slide={{duration: 1000}} out:slide={{duration: 1000}}>
          {#each car.details as detail}
              <p>
                  {detail}
              </p>
          {/each}
      </div>
    -->

    <div class=specs>
        <span class=spec style='text-align: center; min-width: 100%;'><h3 style='min-width:100%'>Vehicle Summary</h3></span>
        <div class=row-wrapper>
          {#each Object.entries(car) as [key, value], index}
              {#if !nonDisplay.includes(key)}
                  <span class=spec>
                      <span class=item>
                          <p id=title>{key.replaceAll('_', ' ')}</p>
                          <p>{value}</p>
                      </span>
                  </span>
              {/if}
          {/each}
        </div>
    </div>
    <!-- <button class=but on:click={()=>toggleDetails(true)}>{showDetails===true?'Less Details':'More Details'}</button> -->
</div>

<style>
    .row-wrapper{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      flex-direction: row;
    }

    .submit {
      margin-top: -10px;
      margin-bottom: 10px;
    }

    .text-wrapper {
      width: 100%;
      min-height: 11.5rem;
    }

    .button-wrapper{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 20px;
      padding: 10px;
    }

    .interest-form {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    .img-wrapper{
      width: 100%;
      height: 100%;
      min-width: 100%;
      min-height: 100%;
      display: flex;
      flex-wrap: nowrap;
      overflow: hidden;
    }

    .car-image img{
      min-width: 100%;
      min-height: 100%;
      max-width: 100%;
      max-height: 100%;
      border-radius: 15px;
    }

    .content{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 5px;
        width: 100%;
        background-color: azure;
        color: black;
    }

    .row-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    #head {
        max-width: 40%;
    }

    .content img{
        max-width: 100%;
        max-height: 100%;
        border-radius: 15px;
    }

    .main-info {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: flex-start;
        /* gap: 5px; */
        padding: 5px;
        border-bottom: 1px solid #ccc;
        width: 100%;
    }

    .spec {
        font-size: 1em;
        /* color: #747474; */
        text-transform: capitalize;
        display: flex;
        flex-direction: row;
        width: 48%;
        border-bottom: 1px solid #ccc;
    }

    @media (max-width: 600px) {
        .spec {
            width: 100%;
        }
    }

    #title-info {
        color: #747474;
        /* border-radius: 15px;
        padding: 10px;
        background-color: #e7e7e7; */
    }

    .specs {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
        padding: 10px;
        border-radius: 15px;
        flex-wrap: wrap;
        /* background-color: #d2d2d2; */
        /* background-color: #e7e7e7; */
        background-color: #e1eaec;
        width: 100%;
    }

    .specs span {
        font-size: 1em;
        /*border-bottom: 1px solid #ccc;*/
        /* min-width: 100%; */
    }

    #title {
        color: #747474;
    }

    .specs span p {
        font-size: 1em;
        margin-bottom: 0;
    }

    .price {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        background: linear-gradient(90deg, #ABD2C4 0%, #ABD2C4 100%);
        background: linear-gradient(90deg, rgba(171,210,196, .20) 0%, rgba(171,210,196, .8) 100%);
        padding: 10px;
    }

    .item {
        min-width: 48%;
        max-width: 48%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }


</style>
