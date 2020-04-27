class CompareCTData extends React.Component{
    constructor(props){
        super(props);
        this.state = {CTData: this.props.CTData, fileContent: null, fileName: "Parameters.xml", error: null};
        this.sortd = this.sortd.bind(this);
         this.sortc = this.sortc.bind(this);
        this.createCTfile = this.createCTfile.bind(this);
        this.removeCT = this.removeCT.bind(this);
        this.CreateGraph = this.CreateGraph.bind(this);
        this.sortC = null;
        this.sortD = null;
    }

    componentDidUpdate(prevProps) {
        if (this.props.CTData !== prevProps.CTData) {
          this.setState({CTData: this.props.CTData, fileContent: null})
        }
    }

    sortd(){
        const data = this.state.CTData;
        if(this.sortD){
            data.root.sort((a, b) => {
                return(b.ct.GainPoly[0].d[0] - a.ct.GainPoly[0].d[0]);
            })
            this.sortD = false;
        } else {
            data.root.sort((a, b) => {
                return(a.ct.GainPoly[0].d[0] - b.ct.GainPoly[0].d[0]);
            })
            this.sortD = true;
        }
        
        this.setState({CTData: JSON.parse(JSON.stringify(data))});
    }

    sortc(){
        const data = this.state.CTData;
        if(this.sortC){
            data.root.sort((a, b) => {
                return(b.ct.GainPoly[0].c[0] - a.ct.GainPoly[0].c[0]);
            })
            this.sortC = false;
        } else {
            data.root.sort((a, b) => {
                return(a.ct.GainPoly[0].c[0] - b.ct.GainPoly [0].c[0]);
            })
            this.sortC = true;
        }
        
        this.setState({CTData: JSON.parse(JSON.stringify(data))});
    }

    getTabularData() {
        const data = this.state.CTData;
        if(data){
            const rows = data.root.map((ct) => {
                if( ct.ct){
                    return(
                        <tr key={ct.ct.$.sn}>
                            <td><input type="checkbox" onClick={() => ct.ct.seleted = !ct.ct.seleted} /></td>
                            <td>{ct.ct.$.sn}-{ct.ct.model[0]}</td>
                            <td className="text-right">{ct.ct.GainPoly[0].a}</td>
                            <td className="text-right">{ct.ct.GainPoly[0].b}</td>
                            <td className="text-right">{ct.ct.GainPoly[0].c}</td>
                            <td className="text-right">{ct.ct.GainPoly[0].d}</td>
                        </tr>
                    );
                }
            })
        
            return(
                <div className="container-fluid">
                    <hr />
                    <div className="row">
                        <div className="col-md-4">
                            <h3 className="text-center">Y-phase Graph</h3>
                            <canvas id="myChart" ></canvas>
                        </div>
                        <div className="col-md-8">
                            <h5 className="text-center">3rd Degree Coefficient - Y gain</h5>
                            <button className="btn btn-sm btn-link float-right" onClick={this.createCTfile}>Create CT file</button>
                            <button className="btn btn-sm btn-link float-right" onClick={this.removeCT}>Remove CT</button>
                            <button className="btn btn-sm btn-link float-right" onClick={this.CreateGraph}>Create Graph</button>
                            <table className="table table-striped table-dark">
                                <thead className="">
                                    <tr>
                                        <th></th>
                                        <th ># CT's</th>
                                        <th className="text-center"><button className="btn btn-sm btn-light" disabled>A</button></th>
                                        <th className="text-center"><button className="btn btn-sm btn-light" disabled>B</button></th>
                                        <th className="text-center">
                                            <button className="btn btn-sm btn-light" onClick={this.sortc}>
                                                C <img src="../logo/sort.png" height="17px"/>
                                            </button>
                                        </th>
                                        <th className="text-center">
                                            <button className="btn btn-sm btn-light" onClick={this.sortd}>
                                                D <img src="../logo/sort.png" height="17px"/>
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </table>
                        </div>
                    </div>
                    
                </div>
            );
        }
    }

    removeCT(){
        const data = this.state.CTData;
        console.log(data)
        const newData = data.root.filter((f) => {
            return(f.ct.seleted !== true);
        });
        this.setState({CTData: {root: newData}});
    }

    createCTfile(){
        const data = this.state.CTData;        
        const selectedFiles = data.root.filter((f) => {
            return(f.ct.seleted === true);
            
        });
        const combinedFile = {root: []}
        combinedFile.root = selectedFiles; 
        const request = {
            url: '/api/createXML',
            method: 'POST',
            data: combinedFile
        }
        axios(request).then((result) => {
            console.log(result);
            this.setState({fileContent: result.data, CTData: null});
        }).catch((err) => {
            console.log(err);
        })  
    }
    ShareFileComponent(){
        const fileContent = this.state.fileContent;
        if(fileContent){
            return(<DownloadNShare fileName={this.state.fileName} fileData={fileContent} uploadTypeProject={false}/>);
        }
    }

    createDataset(){
        const backgroundColor = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(126, 154, 25, 0.2)',
            'rgba(25, 124, 154, 0.2)',
            'rgba(167, 27, 27, 0.2)',
            'rgba(64, 25, 154, 0.2)'
        ];
        const borderColor = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(126, 154, 25, 1)',
            'rgba(25, 124, 154, 1)',
            'rgba(167, 27, 27, 1)',
            'rgba(64, 25, 154, 1)'
        ];
        const xAxis = [-4, -3, -2, -1, 0, 1, 2, 3];
        const finalData = {labels: xAxis, datasets: []};
        const result = []
        const selectedData = this.state.CTData.root.filter((f) => {
            return(f.ct.seleted === true);
        });
        // y = a + b*x + c*x^2 + d*x^3
        selectedData.forEach(element => {
            let a = parseFloat(element.ct.GainPoly[0].a[0]);
            let b = parseFloat(element.ct.GainPoly[0].b[0]);
            let c = parseFloat(element.ct.GainPoly[0].c[0]);
            let d = parseFloat(element.ct.GainPoly[0].d[0]);
            const yAxis = [];
            xAxis.forEach((x) => {
                let y = a + b * x + c * Math.pow(x, 2) + d * Math.pow(x, 3);
                yAxis.push(y);
            });
            result.push({xAxis: xAxis, yAxis: yAxis, label: element.ct.$.sn});
        });
        let count = 0;
        result.forEach((r) => {
            if(count > 9){
                count = 0;
            }
            finalData.datasets.push({label: r.label, data: r.yAxis, borderColor: borderColor[count], backgroundColor: backgroundColor[count]});
            count++
        });
        return(finalData);
    }

    CreateGraph(){
        const yData = this.createDataset();
        const ctx = document.getElementById('myChart').getContext('2d');
        
        if(window.bar != undefined){
            window.bar.destroy();
        }
        window.bar = new Chart(ctx, {
			type: 'line',
            data: yData,
            // Configuration options go here
            options: {
                tooltips: {
                    enabled: true
                }
            } 
        });
    }

    render(){
        const fileContent = this.state.fileContent;
        return(
            <div>
                {this.ShareFileComponent()}
                {this.getTabularData()}
                <XmlViewer fileContent={fileContent} fileName={this.state.fileName}/>
            </div>
        );
    }
} 