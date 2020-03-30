class CreateCTs extends React.Component{
    constructor(props){
        super(props);
        this.state = {fileContent: '', error: null, fileName: 'sample.xml'}
        this.uploadFile = this.uploadFile.bind(this);
        console.log('hitting create ct class constructor');
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
                        onChange={this.uploadFile}
                        multiple={true} /> &nbsp;
                </form>
                <XmlViewer fileContent={fileContent} />
            </div>
        );
    }
}