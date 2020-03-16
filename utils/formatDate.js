function formatDate(date){
    const new_date = new Date(date).toLocaleDateString('en-GB');
    const new_time = new Date(date).toLocaleTimeString('en-GB');
    return `${new_date} ${new_time}`;
}

export default formatDate;