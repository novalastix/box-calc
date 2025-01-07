const boxList=
[
    [6,6,6],
    [8,8,8],
    [10,10,10],
    [12,12,12],
    [14,14,14],
    [16,16,16],
    [18,18,18],
    [20,20,20],
    [24,24,24],
    [9,6,4],
    [10,8,6],
    [12,9,3],
    [12,9,9],
    [12,10,6],
    [12,12,6],
    [14,10,8],
    [15,12,10],
    [16,16,4],
    [17,11,8],
    [18,12,12],
    [18,14,10],
    [18,18,6],
    [20,12,12],
    [20,20,12],
    [22,17,12],
    [24,12,12],
    [24,16,13],
    [20,15,15],
    [24,18,6],
    [24,18,18],
    [24,24,16],
    [28,16,14],
    [30,24,12],
    [30,24,6]
];

const page = 
{
    form: document.getElementById("boxForm"),
    reset: document.getElementById("resetButton"),
    output: document.getElementById("output"),
    length: document.getElementById("length"),
    width: document.getElementById("width"),
    height: document.getElementById("height")
}
const choices = 3;
const maxScore = 54; //Should be equal to the largest girth

function init()
{
    clear();
}

function clear()
{
    page.output.innerHTML="";
    page.length.value = "";
    page.width.value = "";
    page.height.value = "";
}

page.form.addEventListener("submit", (e) => {
    e.preventDefault();

    let dim = [Number(page.length.value),Number(page.width.value),Number(page.height.value)];
    dim.sort(function(a,b){return b-a});

    let boxScores = getScores(dim);

    page.output.innerHTML="";

    for(let i = 0; i < choices; i++)
    {
        if(boxScores[i].score > 0)
        {
            page.output.appendChild(generateOutput(boxScores[i]));
        }
    }
});

function getScores(dim)
{
    let boxScores = [];

    boxList.forEach(box => {

        let boxScore = getScore(dim, box);

        boxScores.push(boxScore);
    })

    boxScores.sort(function(a, b) {return b.score - a.score;});

    return boxScores;
}

function getScore(dim, box)
{
    let boxScore = 
    {
        box: box,
        resize: [],
        score: 0
    }

    if(box[2] >= dim[2]) //Box must be at least high enough
    {
        if((box[0]+box[1]) >= (dim[0]+dim[1])) //Box girth must be at least large enough
        {
            if(box[0] >= dim[0] && box[1] >= dim[1])
            {
                boxScore.resize = [box[0],box[1],dim[2]];
                
                boxScore.score = calculateScore(box,boxScore.resize,dim)//(box[0] - dim[0]) + (box[1] - dim[1]) + (Math.min(box[2]-dim[2],1));
            }
            else
            {
                //Check if diagonal fit is possible
                

                //Check if resizing the box is better
                for(let i = 2; i < (box[0]+box[1]); i++)
                {
                    let newLength = Math.max(i,(box[0]+box[1])-i);
                    let newWidth = (box[0]+box[1]) - newLength;
            
                    if ((Math.abs(newLength - box[0]) >= 2) && (Math.abs(newWidth - box[1]) >= 2)) //avoid changing a box by less than 2 inches
                    {
                        if(newLength >= dim[0] && newWidth >= dim[1]) //box meets new criteria
                        {
                            let tempResize = [newLength,newWidth,dim[2]]
                            let tempScore = calculateScore(box,tempResize,dim)//(newLength - dim[0]) + (newWidth - dim[1]);
            
                            if (tempScore > boxScore.score)
                            {
                                boxScore.score = tempScore;
                                boxScore.resize = tempResize;
                            }
                        }
                    }
                }
            }
        }
    }
    return boxScore;
}

function calculateScore(box,resize,dim)
{
    const boxVolume = resize[0] * resize[1] * resize[2];
    const dimVolume = dim[0] * dim[1] * dim[2];
    const space = boxVolume-dimVolume;
    const maxSpace = 30*24*12;
    
    const volumeScore = (1 - (space / maxSpace)) * 100;
    return volumeScore;
}

function formatScore(score)
{
    return (Math.floor(score * 100) / 100) + "%";
}

function generateOutput(box)
{
    var boxChoice = document.createElement('div');
    boxChoice.classList.add("box-choice");

    var boxSize = document.createElement('h3');
    var boxText = document.createTextNode(box.box);
    boxSize.appendChild(boxText);
    boxChoice.appendChild(boxSize);

    var score = document.createElement('h3');
    score.classList.add("score");
    var scoreText = document.createTextNode(formatScore(box.score));
    score.appendChild(scoreText);
    boxChoice.appendChild(score);
    
    var details = document.createElement('div');
    details.classList.add("details");

    if(box.box[0] == box.resize[0] && box.box[1] == box.resize[1] && box.box[2] == box.resize[2])
    {
        var fit = document.createElement('div');
        if(box.score == 0)
        {
            var fitText = document.createTextNode("Perfect fit!");
        }
        else
        {
            var fitText = document.createTextNode("No cutting necessary.");
        }
        fit.appendChild(fitText);
        details.appendChild(fit);
    }
    else
    {
        if(box.box[0] != box.resize[0] || box.box[1] != box.resize[1])
        {
            //Box resized
            var resize = document.createElement('div');
            var resizeText = document.createTextNode("Resize to " + box.resize[0] +"x"+box.resize[1]);
            resize.appendChild(resizeText);
            details.appendChild(resize);
        }
        if(box.box[2] != box.resize[2])
        {
            //box cut down
            var cut = document.createElement('div');
            var cutText = document.createTextNode("Cut down to " + box.resize[2]);
            cut.appendChild(cutText);
            details.appendChild(cut);
        }
    }

    boxChoice.appendChild(details);
    
    return boxChoice;
}

init();