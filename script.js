//Save the timestamp
let timestamp = "";

//Creating datasets
let precisionDataset =
    {
    label: 'Precision',
    backgroundColor: "#36a2eb",
    borderColor: "#000000",
    borderWidth: 1,
    yAxisID:"perf",
    data: []
};

let recallDataset = {
    label: 'Recall',
    backgroundColor: "#f1f442",
    borderColor: "#000000",
    borderWidth: 1,
    yAxisID:"perf",
    data: []
};

let fscoreDataset = {
    label: 'F-Score',
    backgroundColor: "#ff6384",
    borderColor: "#000000",
    borderWidth: 1,
    yAxisID:"perf",
    data: []
};

let numberOfPublicationsDataSet = {
    label: 'Number of publications',
    backgroundColor: "#53eb3d",
    borderColor: "#000000",
    borderWidth: 1,
    yAxisID:"numberOfPublications",
    data: []
};

let barChartData =
    {
    labels: [],
    datasets: [ precisionDataset, recallDataset, fscoreDataset, numberOfPublicationsDataSet ]
};

window.onload = function()
{
    let ctx = document.getElementById('canvas').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options:
            {
                responsive: true,
                legend: {position: 'top'},
                title:
                    {
                        display: true,
                        text: 'Performances computed by Disease - '+timestamp
                    },
                scales: {
                    yAxes:
                        [
                            {
                                label:"Performance",
                                id: 'perf',
                                type: 'linear',
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    steps: 10,
                                    stepValue: 0.1,
                                    max: 1
                                }
                            },
                            {
                                label:"Number of publications",
                                id: 'numberOfPublications',
                                type: 'linear',
                                position: 'right'
                            }]
                }
            }
    });

    document.getElementById("showAll").addEventListener("click",
        event =>
        {
            if(precisionDataset.length !== 0)
            {
                barChartData.datasets=[ precisionDataset, recallDataset, fscoreDataset, numberOfPublicationsDataSet ];
                window.myBar.update();
            }
        }
    );

    document.getElementById("addRemovePrecision").addEventListener("click",
        event =>
        {
            if(precisionDataset.length !== 0)
            {
                let indexOfPrecisionDataset = barChartData.datasets.map(x => x.label).indexOf("Precision");
                if(indexOfPrecisionDataset === -1)
                {
                    barChartData.datasets.push(precisionDataset);
                }
                else
                {
                    barChartData.datasets.splice(indexOfPrecisionDataset, 1);
                }
                window.myBar.update();
            }
        }
    );

    document.getElementById("addRemoveRecall").addEventListener("click",
        event =>
        {
            if(precisionDataset.length !== 0)
            {
                let indexOfRecallDataset = barChartData.datasets.map(x => x.label).indexOf("Recall");
                if(indexOfRecallDataset === -1)
                {
                    barChartData.datasets.push(recallDataset);
                }
                else
                {
                    barChartData.datasets.splice(indexOfRecallDataset, 1);
                }
                window.myBar.update();
            }
        }
    );

    document.getElementById("addRemoveFscore").addEventListener("click",
        event =>
        {
            if(precisionDataset.length !== 0)
            {
                let indexOfFscoreDataset = barChartData.datasets.map(x => x.label).indexOf("F-Score");
                if(indexOfFscoreDataset === -1)
                {
                    barChartData.datasets.push(fscoreDataset);
                }
                else
                {
                    barChartData.datasets.splice(indexOfFscoreDataset, 1);
                }
                window.myBar.update();
            }
        }
    );

    document.getElementById("addRemoveNumberOfPublications").addEventListener("click",
        event =>
        {
            if(precisionDataset.length !== 0)
            {
                let indexOfNumberOfPublicationsDataset = barChartData.datasets.map(x => x.label).indexOf("Number of publications");
                if(indexOfNumberOfPublicationsDataset === -1)
                {
                    barChartData.datasets.push(numberOfPublicationsDataSet);
                }
                else
                {
                    barChartData.datasets.splice(indexOfNumberOfPublicationsDataset, 1);
                }
                window.myBar.update();
            }
        }
    );


    document.getElementById('loadResults').addEventListener(
        'change',
        function(evt)
        {
            let files = evt.target.files;
            let file = files[0];
            let reader = new FileReader();
            reader.onload = event =>
            {
                let data = JSON.parse(event.target.result);

                //General informations
                document.getElementById("precisionValue").textContent = data.general.Precision;
                document.getElementById("recallValue").textContent = data.general.Recall;
                document.getElementById("fscoreValue").textContent = data.general.F_Score;

                let diseases = data.perDisease;

                //Sort the diseases by NumberOfPublications
                diseases.sort((disease1, disease2)=> disease1.NumberOfPublications - disease2.NumberOfPublications);

                //Create bars
                for(let i =0; i <diseases.length; i++)
                {
                    barChartData.labels.push(diseases[i].OrphaNumber);
                    precisionDataset.data.push(diseases[i].Precision);
                    recallDataset.data.push(diseases[i].Recall);
                    fscoreDataset.data.push(diseases[i].F_Score);
                    numberOfPublicationsDataSet.data.push(diseases[i].NumberOfPublications);
                }

                barChartData.datasets=[ precisionDataset, recallDataset, fscoreDataset, numberOfPublicationsDataSet ];

                timestamp = data.general.TimeStamp;

                window.myBar.update();


            };
            reader.readAsText(file)
        },
        false);

};

