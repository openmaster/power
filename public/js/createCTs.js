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
        //const fileContent = this.state.fileContent;
        //this.setState({fileContent: 'this is my content'})
        //console.log('hitting upload file');

    }

    FileViewer(){
        const fileContent = this.state.fileContent
        return(
            <div className="container">
                <h3 className="text-center">Your file Contents</h3>
                <textarea className="container userFile" readOnly value={fileContent} />
            </div>
        );
    }

    render(){
        return(
            <div className="container">
                <form id="ctFiles" name="ctFiles">
                    <input type="file"
                        id="fileUploader"
                        value={this.state.selectedFile}
                        name="uploadedFile"
                        accept="application/xml" /> &nbsp;
                </form>
                <button className="btn btn-sm btn-info" onClick={this.uploadFile}>Upload</button>
                {this.FileViewer()}                
            </div>
        );
    } 
}