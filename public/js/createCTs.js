class CreateCTs extends React.Component{
    constructor(props){
        super(props);
        this.state = {fileContent: '', error: null, fileName: 'Parameters.xml'}
        this.uploadFile = this.uploadFile.bind(this);
    }

    uploadFile(){
        event.preventDefault();
        const file = document.getElementById('ctFiles');
        let formData = new FormData(file);
        const request = {
            url: '/api/uploadCT',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type':'multipart/form-data'
            }
        }
        axios(request).then((result) => {
            this.setState({fileContent: result.data})
        }).catch((err) => {
            this.setState({error: err});
            console.log(err);
        })
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
            return(<DownloadNShare fileName={this.state.fileName} fileData={fileContent} uploadTypeProject={false}/>);
        }
    }
    render(){
        const fileContent = this.state.fileContent
        const fileName = this.state.fileName
        return(
            <div className="container">
                <form id="ctFiles" name="ctFiles">
                    <input type="file"
                        id="fileUploader"
                        value={this.state.selectedFile}
                        name="uploadedFile"
                        accept="application/xml"
                        onChange={this.uploadFile}
                        multiple={true} />
                </form>
                {this.DownloadNShareComponent()}
                {this.showError()}
                <XmlViewer fileContent={fileContent} fileName={fileName}/>
            </div>
        );
    }
}