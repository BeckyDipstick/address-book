var app = new Vue({
    el: '#app',
    data: {
        addContact: false,
        editContact: false,
        contacts: {},
        search: false,
        //  values for new contact inputs, blank for new contacts and filled in for contact editing
        contactid: 0,
        forename: "",
        surname: "",
        address: "",
        city: "",
        postcode: "",
        dob: "",
        phonenumber: "",
        emailaddress: "",
        county: ""
    },
    methods: {
        // funtion to add new contact. This function shows the form to add a new contact on click
        viewAddContact: function() {
            this.addContact = !this.addContact;
        },

        //  toggling element with input id to show/hide the full contact details on the card.
        viewfullContactDetails: function(contactid) {
            $("#" + contactid).toggle();
        },

        //  function to search contacts.
        viewsearch: function () {
            this.search = !this.search
        },

        // function to search contacts using jquery
        filterSearch: function() {
            //  taking value of search field, .toLowerCase function allows user to type in either upper or lower case without immpairing search result.
            var value = $("#search").val().toLowerCase();
            //  function loops through each contact
            $(".contactDetails").each(function(index) {
                $row = $(this);
                //  finding the full name for the contact
                var $tdElement = $row.find(".fullName:first");
                var id = $tdElement.text().toLowerCase();
                //  checking if full name contains the search value.
                var matchedIndex = id.indexOf(value);
                //  if there is no match the contact is hidden, otherwise it is shown.
                if (matchedIndex < 0) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            })
        },

        //  function makes a form post with new contact form, once its done it redirects to ?done
        saveNewContact: function() {
            $.post("/newcontact", $("#newContact").serialize()).done(window.location.replace("?done"))
        },

        //  function makes a post to remove the contact with the contacts id
        deleteContact: function(id) {
            $.post("/removecontact", {id: id}).done(window.location.replace("?removed"));
        },
        
        //  pre-fills all the information in the new contact/ edit contact form at the top of the page to allow for editing of that contact.
        editContactFill: function(id) {
            this.contactid = this.contacts[id].id;
            this.forename = this.contacts[id].forename;
            this.surname = this.contacts[id].surname;
            this.address = this.contacts[id].address;
            this.city = this.contacts[id].city;
            this.postcode = this.contacts[id].postcode;
            this.dob = moment(this.contacts[id].dob).format("YYYY-MM-DD");
            this.phonenumber = this.contacts[id].phonenumber;
            this.emailaddress = this.contacts[id].emailaddress;
            this.county = this.contacts[id].county;
            this.addContact = true;
            this.editContact = true;
        },
        //  function makes a post request to edit selected contact.
        editContactPost: function() {
            $.post("/editcontact", $("#newContact").serialize()).done(window.location.replace("?done"))
        }
    },

    // function to run when vue loads it gets contacts from json object and adds them to contacts variable.
    created: function () {
        this.$nextTick(function () {
            // Function that will run when vue loads.
            $.getJSON( "/getcontacts", function( data ) {
                app.contacts = data;
                console.log("setting contacts")
                console.log(data);
            });
        })
    },
    //  changes the formatting of the date on the DOB div using moment.
    filters: {
        formateDate: function(value) {
            return moment(value).format("MMMM Do YYYY")
        }
    }
});