class CreateProjectFile extends React.Component{
    constructor(props){
        super(props);
        this.state = {fileContent: null, error: null, fileName: null}
        this.uploadFile = this.uploadFile.bind(this);
    }
    showError() {
        const error = this.state.error;
        if(error){
            return(<div className="alert alert-danger mb-2" role="alert">{error.toString()}</div>);
        }
    }

    DownloadNShareComponent(){
        const fileContent = this.state.fileContent;
        if(fileContent){
            return(<DownloadNShare fileName={this.state.fileName} fileData={this.state.fileContent} uploadTypeProject={true}/>);
        }
    }
  
    render(){
        const fileContent = this.state.fileContent
        const fileName = this.state.fileName
        return(
            <div>
                <div  className="container">
                    <form id="myForm" name="myForm" className="float-center">
                        <input className="form-control-file" 
                            type="file" 
                            id="fileUploder" 
                            value={this.state.selectedFile}
                            name="uploadedFile"
                            accept="application/vnd.ms-excel"
                            multiple={false} 
                            onChange={this.uploadFile} />
                    </form>
                </div>
                {this.showError()}
                {this.DownloadNShareComponent()}
                <XmlViewer fileContent={fileContent} fileName={fileName} />
                <div className="row">
                    <div className="col-md-4">
                         
                    </div>
                    <div className="col-md-8">
                        
                    </div>
                </div>
            </div>
        )
    }
    getFileName(){
        let nam = document.getElementById('fileUploder').files[0].name.toString();
        nam = nam.replace(/clean/gi, "")
        nam = nam.replace(/.xls/gi, "")
        nam = nam.replace(/^_/, "")
        nam = nam.replace(/_$/, "")
        nam = nam + "_project.xml"
        return nam;
    }
    uploadFile(){
        event.preventDefault();
        const file = document.getElementById('myForm');
        const fileName = this.getFileName();
        this.setState({fileName: fileName});
        let formData = new FormData(file);
        const request = {
            url: '/api/upload',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        axios(request).then((result) => {
            this.setState({fileContent: result.data});
        }).catch((err) => {
            this.setState({error: err});
            console.log(err);
        })
    }
}