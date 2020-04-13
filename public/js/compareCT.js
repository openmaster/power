class CompareCTData extends React.Component{
    constructor(props){
        super(props);
        this.state = {CTData: this.props.CTData, fileContent: null, fileName: "Parameters.xml", error: null};
        this.sortd = this.sortd.bind(this);
         this.sortc = this.sortc.bind(this);
        this.createCTfile = this.createCTfile.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.CTData !== prevProps.CTData) {
          this.setState({CTData: this.props.CTData, fileContent: null})
        }
    }

    sortd(){
        const data = this.state.CTData;
        data.root.sort((a, b) => {
            return(a.ct.DegreeCoeff[0].d[0] - b.ct.DegreeCoeff[0].d[0]);
        })
        this.setState({CTData: JSON.parse(JSON.stringify(data))});
    }

    sortc(){
        const data = this.state.CTData;
        data.root.sort((a, b) => {
            return(a.ct.DegreeCoeff[0].c[0] - b.ct.DegreeCoeff[0].c[0]);
        })
        this.setState({CTData: JSON.parse(JSON.stringify(data))});
    }

    getTabularData() {
        const data = this.state.CTData;
        if(data){
            const rows = data.root.map((ct) => {
                if( ct.ct){
                    return(
                        <tr key={ct.ct.$.sn}>
                            <td><input type="checkbox" onClick={() => ct.ct.seleted = true} /></td>
                            <td>{ct.ct.$.sn}-{ct.ct.model[0]}</td>
                            <td className="text-right">{ct.ct.DegreeCoeff[0].a}</td>
                            <td className="text-right">{ct.ct.DegreeCoeff[0].b}</td>
                            <td className="text-right">{ct.ct.DegreeCoeff[0].c}</td>
                            <td className="text-right">{ct.ct.DegreeCoeff[0].d}</td>
                        </tr>
                    );
                }
            })
        
            return(
                <div>
                    <hr/>
                    <h5 className="text-center">3rd Degree Coefficient - Y gain</h5>
                    <button className="btn btn-sm btn-link float-right" onClick={this.createCTfile}>Create CT file</button>
                    <table className="table table-striped table-dark">
                        <thead className="">
                            <tr>
                                <th></th>
                                <th ># CT's</th>
                                <th className="text-center"><button className="btn btn-sm btn-light" disabled>A</button></th>
                                <th className="text-center"><button className="btn btn-sm btn-light" disabled>B</button></th>
                                <th className="text-center">
                                    <button className="btn btn-sm btn-light" onClick={this.sortc}>
                                        C <img src="../logo/sort.svg" height="17px"/>
                                    </button>
                                </th>
                                <th className="text-center">
                                    <button className="btn btn-sm btn-light" onClick={this.sortd}>
                                        D <img src="../logo/sort.svg" height="17px"/>
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
            );
        }
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