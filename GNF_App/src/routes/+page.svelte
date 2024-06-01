<script>
    import { onMount } from 'svelte';
    import { PreApprovalApplicationQuestions } from '$lib/formData.js';
    //import { QuestionForm } from '$lib/QuestionForm.svelte';
    import { userStore, updateUser, resetUser } from '$lib/stores/stores.js';
    import { FirebaseDB as database } from '$lib/firebase/firebase';
    import { ref, set, update, push } from "firebase/database";
    import { fly, fade } from 'svelte/transition';
    import Range from '$lib/components/Range.svelte';
    import BIBinput from '$lib/components/BIBinput.svelte';

    let input = {
        name: '',
        phone: '',
        email: '',
        message: '',
        questions: {}
    };

    let user = $userStore;

    userStore.subscribe(value => {
        user = value;
    });

    const db = database;

    //let questionIndex = PreApprovalApplicationQuestions.length - 1;
    let questionIndex = 0;
    let question = PreApprovalApplicationQuestions[questionIndex];

    PreApprovalApplicationQuestions.forEach(question => {
      if(question.type === 'input'){
        input.questions[question.question] = {};
        question.options.forEach(option => {
          input.questions[question.question][option] = '';
        });
      } else {
        input.questions[question.question] = '';
      }
    });

    let submitButtonElement;

    let rangeVal = 50;

    let selected = '';

    let appOptions = {
        'buy': {
            title: 'Buy',
            options: ['vehicle', 'powersport unit', 'recreational asset', 'commercial asset']
        },
        'sell': {
            title: 'Sell',
            options: ['vehicle', 'powersport unit', 'recreational asset', 'commercial asset']
        }
    }

    let appType = 'Pre-Approval';
    let appCategory = 'Auto';
    let appSubCategory = 'Pre-Approval';
    let appStatus = 'In Progress';
    let appDate = new Date().toLocaleDateString();
    let appTime = new Date().toLocaleTimeString();
    let appDateTime = appDate + ' ' + appTime;
    let appID = appType + ' ' + appCategory + ' ' + appSubCategory + ' ' + appDateTime;

    let newQuestions


    let tracker;

    let app = {
        appType: appType,
        appCategory: appCategory,
        appSubCategory: appSubCategory,
        appStatus: appStatus,
        appDate: appDate,
        appTime: appTime,
        appDateTime: appDateTime,
        appID: appID,
        user: tracker
    };

    let distance = 50;
    let duration = 200;
    let transitionInParams = { x: distance, duration: duration};
    let transitionOutParams = { x: -distance, duration: duration};
    let isVisible = true;
    let currentQuestion = PreApprovalApplicationQuestions[questionIndex].question;

    onMount(() => {
    });

    function handleReset() {
        input = {
            name: '',
            phone: '',
            email: '',
            message: '',
            questions: {}
        };
        questionIndex = 0;
    }

    function writeUserData(user) {
        console.log('User: ', user);
        update(ref(db, 'users', ), {
            [user.phone]: {
                ...user
            }
        });
    }

    function submitApplicationData(app) {
        console.log('App: ', app);
        push(ref(db, 'applications', ), {
                ...app
        });
    }


    let requiredMessage = '';
    let requiredStatus = {
      name: false,
      phone: false,
      email: false
    };
    async function submitForm() {
      let nameQ = 'Almost Done! What is your name?';
      let phoneQ = 'Last Step! What is your phone number?';

      if(input.questions['formType'] === 'sell'){
          tracker.type = 'sell',
          tracker.status = 'new'
      }else if(input.questions['formType'] === 'buy'){
        tracker.type = 'buy';
        tracker.status = 'new';
      }else{
        tracker.name = tracker.questions[nameQ]['First Name'] + ' ' + tracker.questions[nameQ]['Last Name'];
        tracker.phone = tracker.questions[phoneQ]['Phone Number'];
        tracker.type = 'pre-approval';
        tracker.status = 'new';
      }

      console.log('Submitting user info: ', tracker);
      
      if(tracker.name === ''){
        requiredMessage = 'Please enter your name';
        requiredStatus.name = true;
        return;
      }else{
        requiredStatus.name = false;
      }
      if(tracker.phone === '' && tracker.email === ''){
        requiredMessage = 'Please enter your phone number or email';
        requiredStatus.phone = true;
        requiredStatus.email = true;
        return;
      }else{
        requiredStatus.phone = false;
        requiredStatus.email = false;
      }

      submitApplicationData(tracker);

      questionIndex = Infinity;
      // writeUserData(tracker);
    }

    async function handleSelection(option, question=null) {
        console.log('Selected: ', option);
        selected = option;
        if(question){
            input.questions[question] = option;
        }
        updateSelected(option);
    }

    function updateSelected(option='') {
      console.log(input.questions);
      if(questionIndex === 0){
        if(input.questions['formType']){
          selected = input.questions['formType'];
        }else{
          selected = option;
        }
      }else if(input.questions[currentQuestion]){
        selected = input.questions[currentQuestion];
      }else{
        selected = option; 
      }
    }

    async function handleNext() {
        if(questionIndex < PreApprovalApplicationQuestions.length - 1){
            transitionInParams = { x: distance, duration: duration};
            transitionOutParams = { x: -distance, duration: duration};
            isVisible = false;
            questionIndex++;
            setTimeout(() => {
                isVisible = true;
            }, 400); // Delay to wait for fade out transition
        }else if(questionIndex === PreApprovalApplicationQuestions.length - 1){
            submitForm();
            questionIndex++;
        }else{
            console.log('End of questions');
            console.log('User: ', tracker);
        }
        
    }


    async function handleBack() {
        if(questionIndex > 0){
            isVisible = false;
            transitionInParams = { x: -distance, duration: duration};
            transitionOutParams = { x: distance, duration: duration};
            questionIndex--;
            setTimeout(() => {
                isVisible = true;
            }, 400); // Delay to wait for fade out transition
        }else{
            console.log('Start of questions');
        }
    }

  $: {
    if(PreApprovalApplicationQuestions[questionIndex] === undefined){
      currentQuestion = '';
    }else{
      if(questionIndex === 0){
        currentQuestion = 'formType';
      }else if(questionIndex === 1 && input.questions['formType'] === 'buy'){
        {/* currentQuestion = PreApprovalApplicationQuestions[questionIndex].question; */}
        currentQuestion = 'Are you financing?';
      }else if(questionIndex === 2 && input.questions['formType'] === 'buy'){
        currentQuestion = "Do you have a trade in or asset you'd consider selling?";
      }else if(questionIndex === 3 && input.questions['formType'] === 'buy'){
        currentQuestion = 'Would you like your item delivered or pickup yourself?';
      }else if(questionIndex === 4 && input.questions['formType'] === 'buy'){
        currentQuestion = 'How would you like to be contacted?';
      }else{
        currentQuestion = PreApprovalApplicationQuestions[questionIndex].question;
      }
      if(input.questions[currentQuestion]){
        selected = input.questions[currentQuestion];
      }else{
        selected = '';
      }
      console.log(currentQuestion);
    }
  }

    $: {
        app = {
            appType: appType,
            appCategory: appCategory,
            appSubCategory: appSubCategory,
            appStatus: appStatus,
            appDate: appDate,
            appTime: appTime,
            appDateTime: appDateTime,
            appID: appID,
            user: tracker
        };
    }

    $: {
        question = PreApprovalApplicationQuestions[questionIndex];
    }

    $: {
        tracker = {
            name: input.name,
            phone: input.phone,
            email: input.email,
            message: input.message,
            questions: input.questions
        }
        //remove all non numbers from phone
        tracker.phone = tracker.phone.replace(/\D/g, '');
        console.log(tracker);
    }

</script>


<body>
    <div class=content>
        {#if questionIndex === 0}
            <div class=wrapper out:fade in:fade>
                <p>Get pre-approved to buy a car after answering a few questions</p>
            </div>

            {#if isVisible}
            <div class=options-container in:fly={transitionInParams} out:fly={transitionOutParams}>
                <div class=container id=submit>
                    <!-- <button class=action id=main on:click={()=>handleNext()}><h3>Get Pre-Approved Now!</h3></button> -->
                    {#each Object.keys(appOptions) as option, index}
                        <button class=action id={selected===option?'selected':''} on:click={()=>handleSelection(option, 'formType')}>{appOptions[option].title}</button>
                    {/each}
                    <button class=submit on:click={()=>handleNext()}><h3>Start</h3></button>
                    <!--
                    <div class="slidecontainer">
                      <input  type="range" min="1" max="100" bind:value={rangeVal} class="slider" id="myRange">
                      {rangeVal}
                    </div>
                    -->
                </div>

                <div class=container id=or>
                    <h3>
                    -Or-
                    </h3>
                    <button id=scroll on:click={submitButtonElement.scrollIntoView({behavior: "smooth", inline: "nearest"})}>In a hurry?</button>
                    <!-- element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" }); -->
                </div>

                <div class=container id=mini-info>
                    <p bind:this={submitButtonElement}>Leave your information and we can get back to you later!</p>
                    <BIBinput width={100} type={'text'} placeholder={"First and Last Name"} label={"Name"} bind:value={input.name}/>
                    <BIBinput width={100} max=10 type={'phone'} placeholder={"123-456-7890"} label={"Phone"} bind:value={input.phone}/>
                    <BIBinput width={100} type={'text'} placeholder={"EpicDeals@gnsf.com"} label={"E-Mail"} bind:value={input.email}/>
                    <!-- <input type="text" name="Name" placeholder="Name" bind:value={input.name}/>
                    <input type="tel" name="Phone" maxLength=12 
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" 
                    placeholder="123-456-7890"
                    bind:value={input.phone}
                    /> -->
                    <!-- <input type="email" placeholder="E-mail" bind:value={input.email}/> -->
                    <span class=label>Leave us a message!</span>
                    <textarea name="paragraph_text" cols="50" rows="10"
                    placeholder="I want to buy a used truck" bind:value={input.message}></textarea>
                    <button class=submit on:click={()=>submitForm()}><h3>Submit</h3></button>
                </div>
            </div>
            {/if}
        {:else if questionIndex === 1 && input.questions['formType'] === 'sell'}

          {#if isVisible}
                <div class=container id=mini-info in:fly={transitionInParams} out:fly={transitionOutParams}>
                    <p bind:this={submitButtonElement}>Leave your information and we can get back to you later!</p>
                    <BIBinput width={100} bind:required={requiredStatus.name} type={'text'} placeholder={"First and Last Name"} label={"Name"} bind:value={input.name}/>
                    <BIBinput width={100} bind:required={requiredStatus.phone} max=10 type={'phone'} placeholder={"123-456-7890"} label={"Phone"} bind:value={input.phone}/>
                    <BIBinput width={100} bind:required={requiredStatus.email} type={'text'} placeholder={"BestDeals@gnsf.com"} label={"E-Mail"} bind:value={input.email}/>
                    <span class=label>What are you selling and how much do you want for it?</span>
                    <textarea name="paragraph_text" cols="50" rows="10"
                    placeholder="example: 2018 ford f150 sport 50000km $25,000" bind:value={input.message}></textarea>
                    <div class=row-container id=actions>
                        <button class=back on:click={()=>handleBack()}><h3>Back </h3></button>
                        <button class=submit on:click={()=>submitForm()}><h3>Submit</h3></button>
                    </div>
                </div>
            {/if}
          
        {:else if questionIndex === 1 && input.questions['formType'] === 'buy'}

          {#if isVisible}
            <div class=options-container in:fly={transitionInParams} out:fly={transitionOutParams}>
                <div class=container id=mini-info>
                    <p bind:this={submitButtonElement}>What is your price range?</p>
                    <div class=row-container>
                      <BIBinput width={55} bind:required={requiredStatus.name} type={'text'} placeholder={"$0"} label={"Min"} bind:value={input.questions['priceMin']}/>
                      <BIBinput width={55} bind:required={requiredStatus.name} type={'text'} placeholder={"200,000"} label={"Max"} bind:value={input.questions['priceMax']}/>
                    </div>
                    <span class=q-title>Are you financing?</span>
                    <div class=row-container id=row-options>
                      <button class=q-action id={selected==='yes'?'selected':''} on:click={()=>handleSelection('yes', 'Are you financing?')}>Yes</button>
                      <button class=q-action id={selected==='no'?'selected':''} on:click={()=>handleSelection('no', 'Are you financing?')}>No</button>
                    </div>
                    {#if input.questions['Are you financing?'] === 'yes'}
                      <span class=q-title>What is your monthly budget?</span>
                      <div class=row-container>
                        <BIBinput width={55} bind:required={requiredStatus.name} type={'text'} placeholder={"$10"} label={"Min"} bind:value={input.questions['budgetMin']}/>
                        <BIBinput width={55} bind:required={requiredStatus.name} type={'text'} placeholder={"$1,000"} label={"Max"} bind:value={input.questions['budgetMax']}/>
                      </div>
                    {/if}
                  <div class=row-container id=actions>
                      <button class=back on:click={()=>handleBack()}><h3>Back </h3></button>
                      <button class=submit id=question on:click={()=>handleNext()}><h3>{questionIndex===(PreApprovalApplicationQuestions.length-1)?'Submit':'Next'}</h3></button>
                  </div>
                </div>
              </div>
            {/if}

        {:else if questionIndex === 2 && input.questions['formType'] === 'buy'}

          {#if isVisible}
            <div class=options-container in:fly={transitionInParams} out:fly={transitionOutParams}>
                <div class=container id=mini-info>
                    <span class=q-title>Do you have a trade in or asset you'd consider selling?</span>
                    <div class=row-container id=row-options>
                      <button class=q-action id={selected==='yes'?'selected':''} on:click={()=>handleSelection('yes', "Do you have a trade in or asset you'd consider selling?")}>Yes</button>
                      <button class=q-action id={selected==='no'?'selected':''} on:click={()=>handleSelection('no', "Do you have a trade in or asset you'd consider selling?")}>No</button>
                    </div>
                    {#if input.questions["Do you have a trade in or asset you'd consider selling?"] === 'yes'}
                      <span class=q-title>Enter the information below</span>
                      <textarea name="paragraph_text" cols="50" rows="10"
                      placeholder="example: 2018 ford f150 sport 50000km" bind:value={input.questions['tradeInMessage']}></textarea>
                    {/if}
                  <div class=row-container id=actions>
                      <button class=back on:click={()=>handleBack()}><h3>Back </h3></button>
                      <button class=submit id=question on:click={()=>handleNext()}><h3>{questionIndex===(PreApprovalApplicationQuestions.length-1)?'Submit':'Next'}</h3></button>
                  </div>
                </div>
              </div>
            {/if}
        {:else if questionIndex === 3 && input.questions['formType'] === 'buy'}

          {#if isVisible}
            <div class=options-container in:fly={transitionInParams} out:fly={transitionOutParams}>
                <div class=container id=mini-info>
                    <span class=q-title>Where are you located?</span>
                    <BIBinput width={100} type={'text'} placeholder={"Province"} label={"Province"} bind:value={input.questions['province']}/>
                    <BIBinput width={100} type={'text'} placeholder={"City"} label={"City"} bind:value={input.questions['city']}/>
                    <span class=q-title>Would you like your item delivered or pickup yourself?</span>
                    <div class=row-container id=row-options>
                      <button class=q-action id={selected==='delivery'?'selected':''} on:click={()=>handleSelection('delivery', 'Would you like your item delivered or pickup yourself?')}>Delivery</button>
                      <button class=q-action id={selected==='pickup'?'selected':''} on:click={()=>handleSelection('pickup', 'Would you like your item delivered or pickup yourself?')}>Pickup</button>
                    </div>



                  <div class=row-container id=actions>
                      <button class=back on:click={()=>handleBack()}><h3>Back </h3></button>
                      <button class=submit id=question on:click={()=>handleNext()}><h3>{questionIndex===(PreApprovalApplicationQuestions.length-1)?'Submit':'Next'}</h3></button>
                  </div>
                </div>
              </div>
            {/if}


        {:else if questionIndex === 4 && input.questions['formType'] === 'buy'}

          {#if isVisible}
            <div class=options-container in:fly={transitionInParams} out:fly={transitionOutParams}>
                <div class=container id=mini-info>
                    <span class=q-title>Last thing</span>
                    <BIBinput width={100} bind:required={requiredStatus.name} type={'text'} placeholder={"First and Last Name"} label={"Name"} bind:value={input.name}/>
                    <BIBinput width={100} bind:required={requiredStatus.phone} max=10 type={'phone'} placeholder={"123-456-7890"} label={"Phone"} bind:value={input.phone}/>
                    <BIBinput width={100} bind:required={requiredStatus.email} type={'text'} placeholder={"EpicDeals@gnsf.com"} label={"E-Mail"} bind:value={input.email}/>
                    <span class=q-title>How would you like to be contacted?</span>
                    <button class=q-action id={selected==='phone'?'selected':''} on:click={()=>handleSelection('phone', 'How would you like to be contacted?')}>Phone</button>
                    <button class=q-action id={selected==='text'?'selected':''} on:click={()=>handleSelection('text', 'How would you like to be contacted?')}>Text</button>
                    <button class=q-action id={selected==='email'?'selected':''} on:click={()=>handleSelection('email', 'How would you like to be contacted?')}>Email</button>




                  <div class=row-container id=actions>
                      <button class=back on:click={()=>handleBack()}><h3>Back </h3></button>
                      <button class=submit id=question on:click={()=>submitForm()}><h3>Submit</h3></button>
                  </div>
                </div>
              </div>
            {/if}

        {:else}
            <div class=success>
                <div class=wrapper in:fly={transitionInParams}>
                    <h3>Thank you, we'll get in touch ASAP</h3>
                </div>
                <div class=row-container>
                  <!--<button class=inventory><a href="/inventory"><h3>View Inventory</h3></a></button> -->
                    <button class=back on:click={()=>handleReset()}><h3>Start Over</h3></button>
                    <!--<button class=home><a href="/"><h3>Home</h3></a></button>-->
                    <!--
                      <button class=back on:click={()=>handleBack()}><h3>Back </h3></button>
                      <button class=submit id=question on:click={()=>handleNext()}><h3>Next</h3></button>
                    -->
                </div>
            </div>
        {/if}
    </div>
</body>

<style>
  @import "../global-dark.css";

  #scroll{
    background: none;
    background-color: azure;
    color: black;
    width: 100%;
    margin-top: 55px;
  }

  .slidecontainer {
    width: 100%;
  }

  .q-title {
    margin-top: 10px;
    text-align: center;
  }

    /* The slider itself */
  .slider {
    -webkit-appearance: none;  /* Override default CSS styles */
    appearance: none;
    width: 100%; /* Full-width */
    height: 15px; /* Specified height */
    /* background: #d3d3d3; Grey background */
    background: azure;
    border-radius: 15px;
    outline: none; /* Remove outline */
    opacity: 0.8; /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: .2s; /* 0.2 seconds transition on hover */
    transition: opacity .2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    width: 25px; /* Set a specific slider handle width */
    height: 25px; /* Slider handle height */
    /* background: #04AA6D; Green background */
    background: linear-gradient(#2C433B, #123d30);
    border-radius: 50%;
    cursor: pointer; /* Cursor on hover */
  }

  /* Mouse-over effects */
  .slider:hover {
    opacity: 1; /* Fully shown on mouse-over */
  }

    /* .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        width: 100%;
    } */

    .questionWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        width: 100%;
  }

    .test-wrapper {
      width: 100%;
    }
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: inherit;
        justify-content: flex-start;
        padding: 20px;
        min-height: 100vh;
    }

    .success {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 50%;
        max-width: 50%;
        gap: 20px;
        //border: 1px solid #2B443C;
    }

    .success .back {
        width: 100%;
    }

    #mini-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    p {
        text-align: center;
    }


    .row-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }

    #row-options {
      width: 100%;
    }

    #actions.row-container {
      margin-top: 20px;
    }

    h3 {
      margin: 0;
    }

    .label {
        margin: 0;
        min-width: 100%;
        text-align: left;
        margin-bottom: -10px;
        margin-left: 20px;
    }

    #submit {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    #or {
      display: flex;
      flex-direction: column;
      align-items: center;
      /* min-width: 100px;
      max-width: 100px;
      width: 100px; */
    }

    .options-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        height: inherit;
        gap: 10px;
    }

    .submit{
      width: 100%;
      width: 200px;
    }

    #question.submit {
        margin: 0 auto;
    }

    .back {
        background: none;
        background-color: azure;
        color: black;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .q-action {
        width: 100%;
        background-color: azure;
        border: 1px solid #2B443C;
        /* color: #2B443C; */
        color: black;
        background: azure;
    }

    .action {
        width: 100%;
        background-color: azure;
        border: 1px solid #2B443C;
        /* color: #2B443C; */
        color: black;
        background: azure;
    }

    #selected {
        background-color: #0665C1;
        border: 2px solid azure;
        color: azure;
        transform: translate(1px, 1px);
    }

    #main.action {
        background: linear-gradient(#2C433B, #123d30);
        color: azure
    }


    .input-container {
        /* display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center; */
        /* gap: 20px; */
        position: relative;
        width: 100%;
    }

    .input-container label {
        font-size: 1.2em;
        text-wrap: nowrap;
        align-items: center;
        position: absolute;
        color: black;
        transform: translateY(-50%);
        top: 50%;
        left: 10px;
    }

    .input-container input {
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #2B443C;
        background-color: azure;
        color: black;
        margin: 0;
    }

</style>
