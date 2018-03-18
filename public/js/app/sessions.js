(function () {
    
window.ccSessions = {

    getSessions : function(){

        return fetch("api/philly-cc-schedule.json")
            .then(function(response){

                if(response.ok){

                    return response.json();

                }else{

                    throw "session fetch failed";
                }

            });

    },

    getSession : function(id){

        return fetch("api/sessions/" + id + ".json")
            .then(function(response){

                if(response.ok){

                    return response.json();

                }else{

                    throw "session fetch failed";
                }

            });

    }

}
    
})();