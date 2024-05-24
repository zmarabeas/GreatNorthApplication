


// Select all of the following that you are interested in exploring:

// -Buy, lease or rent a vehicle, powersport unit, recreational or commercial asset

// -Sell or trade a vehicle, powersport unit, recreational or commercial asset

// -Obtain a personal loan or business loan

// -Buy a property

// -Sell a property

// (Prompt if vehicle is selected) 1. Select the type of vehicle(s) or assets you would consider:
 
// ['Car', 'Truck', 'SUV', 'Van', 'Motorcycle', 'Boat, Trailer, RV, Other (type box)']

// (Prompt if loan is selected) 1. Select the range of loan that would help accomplish your goals:
 
// [Minimum: [type box], Maximum [type box] ']

// (Prompt if buy or sell a property is selected) 
// If applicable, please notate the addresses of the properties and / or paste a web link. 
// (If no applicable addresses at this time, leave the space blank and press continue)
// [txt box]


// What is your budget? (We need a spot for overall spend range on the vehicle or property min-max and a second slide or question for payment range: min - max (let them type) (always do a range)

// What are you selling or trading?
// [year / make / model / km/hours est ]

// How is your credit history?
// Excellent, Fair, Needs work, Very bad
// Do you want to improve your credit Y/N?
// Do you want to learn how to read a credit report?

// Phone number, is call or text preferred? Optional text box for email or other contact method

// Secondary tree..

// Are you interested in seeing what you qualify for right now?

// What is your current employment status?
// ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Other']

// What is an estimate of your annual income before deductions?
// ['Salary $']

// How long have you been receiving this income?
// ['Years', 'Months']

// What do you work?
// ['Company', 'Job Title']

// What address can we use for your residence? (this matters because particular lenders have provincial and municipal restrictions)
// ['Address', 'City', 'Province', 'Postal Code'] (option to skip)

// How long have you lived at your current address?
// ['Years', 'Months'] (option to skip)

// Do you rent or own your home?
// ['Rent', 'Own']
// What is the monthly payment?
 
// ['$ Per Month']

// Are you a Canadian citizen or permanent resident?
// ['Yes', 'No']

// Do you have a valid Canadian driver's licence?
// ['Yes', 'No']

// What is your date of birth?
// ['Date', 'Month', 'Year']

// Almost Done! What is your name?
// ['First Name', 'Last Name']

// Last Step! What is your phone number?
// ['Phone Number']

export const PreApprovalApplicationQuestions = [
    {
        "question": "What type of vehicle are you looking for?",
        "description": "Get Pre-Approved for the Car You Want at a Price You Can Afford",
        "options": ["Car", "Truck", "SUV", "Van", "Motorcycle", "Other"],
        "type": "radio"
    },
    {
        "question": "What is your budget?",
        "description": "Find vehicle options that fit your budget.",
        "options": ["Under $400 / Month", "$400 - 499 / Month", "$500 - 599 / Month", "Over $600 / Month"],
        "type": "radio"
    },
    {
        "question": "Do you have a trade-in?",
        "description": "Get the most for your trade-in.",
        "options": ["Yes", "No"],
        "type": "radio"
    },
    {
        "question": "What is your credit score?",
        "description": "We have great rates available for all credit types.",
        "options": ["Good (Over 650)", "Fair (600-659)", "Poor (Under 599)", "Current Bankruptcy", "No Credit / Unsure"],
        "type": "radio"
    },
    {
        "question": "What is your current employment status?",
        "description": "Your employment status will help determine the best vehicle and financing options for you.",
        "options": ["Employed", "Self-Employed", "Unemployed", "Retired", "Other"],
        "type": "radio"
    },
    {
        "question": "What is your annual income before taxes and deductions?",
        "description": "Please tell us how much you make per year from your primary source of income, including total wages, bonuses, commissions, and any other income.",
        "options": ["Salary"],
        "type": "input",
        "inputType": "number"
    },
    {
        "question": "How long have you been receiving this income?",
        "description": "Enter 1 month if you just started your job.",
        "options": ["Years", "Months"],
        "type": "input",
        "inputType": "number"
    },
    {
        "question": "Where do you work?",
        "description": "We won't come visit, but we need these details to confirm your employment status so you can get the best rates possible.",
        "options": ["Company", "Job Title"],
        "type": "input",
        "inputType": "text"
    },
    {
        "question": "Where are you looking for a vehicle?",
        "description": "",
        "options": ["Address", "City", "Province", "Postal Code"],
        "type": "input",
        "inputType": "text"
    },
    {
        "question": "How long have you lived at your current address?",
        "description": "",
        "options": ["Years", "Months"],
        "type": "input",
        "inputType": "number"
    },
    {
        "question": "Do you rent or own your home?",
        "description": "",
        "options": ["Rent", "Own"],
        "type": "radio",
        "inputType": ""
    },
    {
        "question": "What is your monthly payment?",
        "description": "",
        "options": ["Per Month"],
        "type": "input",
        "inputType": "number"
    },
    {
        "question": "Are you a Canadian citizen or permanent resident?",
        "description": "",
        "options": ["Yes", "No"],
        "type": "radio",
    },
    {
        "question": "Do you have a valid Canadian driver's licence?",
        "description": "",
        "options": ["Yes", "No"],
        "type": "radio",
    },
    {
        "question": "What is your date of birth?",
        "description": "",
        "options": ["Date", "Month", "Year"],
        "type": "input",
        "inputType": "number",
    },
    {
        "question": "Almost Done! What is your name?",
        "description": "",
        "options": ["First Name", "Last Name"],
        "type": "input",
        "inputType": "text",
    },
    {
        "question": "Last Step! What is your phone number?",
        "description": "",
        "options": ["Phone Number"],
        "type": "input",
        "inputType": "phone",
    },
    




]
