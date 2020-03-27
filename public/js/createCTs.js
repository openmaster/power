class CreateCTs extends React.Component{
    constructor(props){
        super(props);
        this.state = {fileContent: '', error: null, fileName: 'sample.xml'}
        this.uploadFile = this.uploadFile.bind(this);
        console.log('hitting create ct class constructor');
    }

    fileProcessingButton(){
        
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

    render(){
        const fileContent = this.state.fileContent
        return(
            <div className="container">
                <form id="ctFiles" name="ctFiles">
                    <input type="file"
                        id="fileUploader"
                        value={this.state.selectedFile}
                        name="uploadedFile"
                        accept="application/xml"
                        multiple="true" /> &nbsp;
                </form>
                <button className="btn btn-sm btn-info" onClick={this.uploadFile}>Upload</button>
                <XmlViewer fileContent={fileContent} />

            </div>
        );
    } 
}