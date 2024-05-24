
<script>
    export let width = 100;
    export let value = null;
    export let placeholder;
    export let label='label';
    export let type='text';
    export let max;


    function formatNumber(input, max) {
        // Remove all non-numeric characters
        let formattedString = input.replace(/\D/g, '');


        // Cap at the maximum number of digits
        if (max !== undefined && formattedString.length > max) {
            formattedString = formattedString.slice(0, max);
        }

        // Insert comma every three digits from the right
        formattedString = formattedString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return formattedString;
    }

    function formatPhone(input) {
        // Remove all non-numeric characters
        let formattedString = input.replace(/\D/g, '');


        // Cap at the maximum number of digits
        if (max !== undefined && formattedString.length > 10) {
            formattedString = formattedString.slice(0, 10);
        }

        // Insert a dash after the third digit and after the sixth digit
        if (formattedString.length > 3) {
            formattedString = formattedString.slice(0, 3) + '-' + formattedString.slice(3);
        }

        if (formattedString.length > 7) {
            formattedString = formattedString.slice(0, 7) + '-' + formattedString.slice(7);
        }


        return formattedString;
    }


    let formattedValue = '';
    $: {
        // format value to commas every 3 digits
        if(type==='number'){
            formattedValue = formatNumber(value, max);
            value = formattedValue;
        }else if(type==='phone'){
            formattedValue = formatPhone(value);
            value = formattedValue;
        }
    }

</script>

<div class=bib-container style="max-width:{width}%">
    <span class=bib-sp>{label} ❯ </span>
    <input class=bib-inp type="text" placeholder={placeholder} bind:value>
</div>


<style>
    .bib-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: azure;
        color:black;
        border-radius: 15px;
        height: 100%;
        /* padding: 20px; */
        width: 100%;
        padding: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.3); 
    }

    .bib-container:focus-within {
        outline: 2px solid #183E31;
    }

    .bib-container:hover {
        transform: scale(1.01);
        box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);
    }

    input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active{
    -webkit-box-shadow: 0 0 0 30px azure inset !important;
}

    .bib-inp {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 10px;
        color: black;
        font-size: .8em;
        border: none;
        background-color: rgba(0, 0, 0, 0.0);
        text-align: right;
    }

    .bib-inp:focus {
        outline: none;
        background-color: rgba(0, 0, 0, 0.0);
    }

    .bib-sp {
        font-size: 1em;
        text-wrap: nowrap;
        align-items: center;
        color: black;
    }

</style>