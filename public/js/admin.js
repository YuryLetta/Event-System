function removeSpeaker(ID, thisSope) {
    $.ajax({
        url: 'http://localhost:8080/speakers/delete/' + ID,
        method: 'get',
        dataType: 'text',
        success(data){
            $(thisSope).parents("tr").remove();
        },
        error(error){
            console.log(error);
        }
    });
}
function removeEvent(ID, thisSope) {
    $.ajax({
        url: 'http://localhost:8080/events/delete/' + ID,
        method: 'get',
        dataType: 'text', // type of response data
        success: function (data) { // success callback function
            $(thisSope).parents("tr").remove();
        },
        error: function (error) { // error callback 
            console.log(error);
        }
    });
}
