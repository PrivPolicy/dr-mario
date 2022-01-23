{
    let c = "color:red;background-color:black;font-size:24px;padding:10px 20px;border:2px solid red;border-radius:15px;background-image:url('https://i.imgur.com/jUDOzg4.jpg');background-size:100% 100%;";

    let todo = [
        "Po przegranej restart gry od początku",
        "SYNCHRONICZNE OPADANIE"
    ];

    todo.forEach((element, index) => {
        console.log("%c" + `${index + 1}. ` + element, c);
    });
}