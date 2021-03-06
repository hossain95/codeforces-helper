document.getElementById("form3").addEventListener("submit", (e)=>
{
    e.preventDefault();
    //reload
    $( "#output").load("index.html #output");
    //display
    document.getElementById("error").style.display = "none";
    document.getElementById("loading").style.display = "";
    document.getElementById("singleUserOutput").style.display = "none";
    document.getElementById("twoUserOutput").style.display = "none";
    document.getElementById("standing1").style.display = "none";
    document.getElementById("standing2").style.display = "none";

    var orgName = document.getElementById("organization").value;
    var contestId = document.getElementById("contestid").value;
    console.log(orgName);
    console.log(contestId);

    const AllUser = fetch(`https://codeforces.com/api/user.ratedList?activeOnly=true`);
    const Round = fetch(`https://codeforces.com/api/contest.standings?contestId=${contestId}&showUnofficial=true`);
    Promise.all([AllUser, Round]).then((values)=>
    {
        return Promise.all(values.map(r=>r.json()));
    }).then(([AllUser, Round]) =>
    {
        console.log(AllUser);
        console.log(Round);
        var handleObj = {};
        var result = AllUser.result;
        for(i = 0; i < result.length; i++)
        {
            if(result[i].organization === orgName)
            {
               handleObj[result[i].handle] = result[i].rating;
            }
        }
        
        var standing = Round.result.rows;
        var info = [];
        for(i = 0; i < standing.length; i++)
        {
            var findHandle = standing[i].party.members;
            findHandle = findHandle[0].handle;
            //var ok = handleArr.includes(findHandle);//here
            if(handleObj[findHandle] > 0)
            {
                if(standing[i].party.participantType === "CONTESTANT")
                {
                    var arr = [];
                    var rank = standing[i].rank;
                    if(rank === 0)
                    {
                        rank = standing.length;
                    }
                    arr.push(rank);
                    arr.push(findHandle);
                    arr.push(standing[i].points);
                    arr.push(handleObj[findHandle]);
                    info.push(arr);
                }
            }
        }
        console.log(info);
        document.getElementById("tableOrgName").innerText = orgName;
        for(i = 0; i < info.length; i++)
        {
            const trow = document.createElement('tr');
            document.getElementById("table").appendChild(trow);
            trow.setAttribute('id', "tr1"+i);
            if(i%2 == 1)
            {
                document.getElementById("tr1"+i).style.backgroundColor = "#fff";
            }
            const th5 = document.createElement('th');
            document.getElementById("tr1"+i).appendChild(th5);
            th5.setAttribute('id', "th1"+i);
            document.getElementById("th1"+i).innerText = i+1;
        
            const th6 = document.createElement('th');
            document.getElementById("tr1"+i).appendChild(th6);
            th6.setAttribute('id', "th2"+i);
            document.getElementById("th2"+i).innerText = info[i][0];
        
            const th7 = document.createElement('th');
            document.getElementById("tr1"+i).appendChild(th7);
            th7.setAttribute('id', "th3"+i);
            document.getElementById("th3"+i).innerText = info[i][1];
        
            const th8 = document.createElement('th');
            document.getElementById("tr1"+i).appendChild(th8);
            th8.setAttribute('id', "th4"+i);
            document.getElementById("th4"+i).innerText = info[i][2];
        }
        document.getElementById("table").style.borderStyle = "solid";
        document.getElementById("table").style.borderWidth = "2px";
        //display
        document.getElementById("loading").style.display = "none";
        document.getElementById("singleUserOutput").style.display = "none";
        document.getElementById("twoUserOutput").style.display = "none";
        document.getElementById("standing1").style.display = "";
        document.getElementById("standing2").style.display = "none";
    }).catch((e) =>
    {
        console.log(e);
        document.getElementById("loading").style.display = "none";
        document.getElementById("error").style.display = "";
        document.getElementById("error").innerText = "Something is Worng Please Try Again";
    });
});