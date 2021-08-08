const MainContainer = document.querySelector('.MainContainer');
const URLInput = document.querySelector('#URLInput');

// Modal Elements
const ModalButton = document.querySelector('#DownloadBtn');
const ModalResultContainer = document.querySelector('.Result');

// Quick Note Elements
const QuickNoteContainer = document.querySelector('.QuickNote');
const NoteButton = document.querySelector('#NoteButton');

NoteButton.addEventListener('click', e => QuickNoteContainer.remove());

/**
 * Loading Animation while waiting for Data being Fetched
 */
const SetLoading = () => {
    const LoadingAnimation = document.createElement('img');
    LoadingAnimation.src = '../assets/loading.gif';
    const LoadingContainer = document.createElement('div');
    LoadingContainer.className = 'Loading';
    LoadingContainer.appendChild(LoadingAnimation);

    return LoadingContainer;
}
/**
 * @param {String} Text
 * @param {Number} Count 
*/
const DescriptionLimiter = (Text, Count) => {
    if(Text.length <= 0 || Text ==  null)
        return 'No description';
    else
        return Text.slice(0, Count) + (Text.length > Count ? "..." : "");
}
/**
 * 
 * @param {String} FormatName 
 * Video/Audio format name
 * @param {String} FormantDownloadableURL 
 * Downloadable URL
 */
const Downloadable = (FormatName, FormatDownloadableURL) => {
    const DownloadableBtn = document.createElement('button');
    DownloadableBtn.innerHTML = FormatName;
    DownloadableBtn.id = 'Downloadables';
    DownloadableBtn.addEventListener('click', e => window.open(FormatDownloadableURL,'_blank'));
    return DownloadableBtn;
}
// Modal for the Result View
/**
 * 
 * @param {String} Title 
 * title of the Youtube video
 * @param {String} Description 
 * description of the Youtube video
 * @param {String} Thumbnail 
 * thumbnail of the Youtube video
 * @param {Array} DownloadableStream 
 * Array of all Downloadable file formats
 */
const ModalResult = (Thumbnail, Title, Description, DownloadableStream) => {
    
    const ModalCancelButton = document.createElement('button');
    ModalCancelButton.innerHTML = 'Cancel';
    ModalCancelButton.className = 'TextDark';
    ModalCancelButton.addEventListener('click', e => ResultContainer.remove());

    const ResultThumbnail = document.createElement('img');
    ResultThumbnail.src = Thumbnail;

    const ResultTitle = document.createElement('h3');
    ResultTitle.innerHTML = Title;
    ResultTitle.className = 'TextDark';

    const ResultDescription = document.createElement('p');
    ResultDescription.innerHTML = DescriptionLimiter(Description, 250);
    ResultDescription.className = 'TextDark';

    const ResultDownloadableContent = document.createElement('div');
    ResultDownloadableContent.className = 'DownloadableContent';

    DownloadableStream.length <= 0 ? 
    (
        ResultDownloadableContent.createElement('h1').innerHTML = 'No available format downloadable'
    )
    :
    DownloadableStream.map(Stream => {
        Stream.qualityLabel == null || !Stream.hasAudio ?
        null
        :
        ResultDownloadableContent.appendChild(Downloadable(Stream.qualityLabel, Stream.url));
    });

    const ResultContainer = document.createElement('div');
    ResultContainer.className = 'Result';
    ResultContainer.append(
                    ModalCancelButton, 
                    ResultThumbnail, 
                    ResultTitle, 
                    ResultDescription, 
                    ResultDownloadableContent
                    );
    return ResultContainer;
}

/**
 * 
 * @param {String} url accepts URL strictly from Youtube if otherwise will throw an error
 */
const GetVideoDownloadable = async(url) => {
    try{
        const Data = await fetch(`./GetInfoDownloadable?url=${url}`,{
            method: 'GET'
        });
        return Data.json();
    }
    catch(error){
        alert(error);
    }
}

ModalButton.addEventListener('click', 
    e => {
        e.preventDefault();
        MainContainer.appendChild(SetLoading());

        GetVideoDownloadable(URLInput.value)
        .then(({VideoDetails: VideoInformation, DownloadStream: Stream}) => 
        {
            MainContainer.getElementsByClassName('Loading').item(0).remove();
            console.log(VideoInformation, Stream);
            const {title: Title, description: Description, thumbnails: Thumbnails} = VideoInformation;
            MainContainer.appendChild(ModalResult(Thumbnails[4].url, Title, Description, Stream));
        }
        )
        .catch(err => alert(err));
    }
)
