/**
 * Description: This is a simple HTML5 video player that loops through a remote or local playlist
 * Created by: Benedict Paras
 */

( function() {
	/* Variables */
	let	tm_playlistRemoteUrl = document.getElementById("tm_player").getAttribute("player_listsrc_remote"),
		tm_playlistLocalUrl = document.getElementById("tm_player").getAttribute("player_listsrc_local"),
		tm_source,
		tm_urlList = [],
		tm_urlNumber = 1,
		tm_currentVideo = 0,
		tm_filename,
		tm_jsonList,
		tm_playerWidth = document.getElementById("tm_player").getAttribute("player_width"),
		tm_playerHeight = document.getElementById("tm_player").getAttribute("player_height"),
		tm_video = document.createElement('video');

		tm_video.autoplay = true;
		tm_video.muted = true;
		tm_video.width = tm_playerWidth;
		tm_video.height = tm_playerHeight;

		document.getElementById('tm_video').append(tm_video);
		document.getElementById('tm_video').style.backgroundColor = "black"; 
	/**
	 * Adds a source to the video element
	 */
	function addVideoSource(element, src, type) {
		tm_source = document.createElement('source');
		tm_source.src = src;
		tm_source.type = type;
		element.appendChild(tm_source);				
	}
	/**
	 * Ajax function to retrieve playlist
	 */
	function getPlaylist(url) {
			console.log("Attempting to get", url);
			return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.onload = () => resolve(xhr.responseText);
			xhr.onerror = () => reject(xhr.statusText);
			xhr.send();
			});
	}
	/**
	 * Processes a JSON formatted playlist like:
	 *	{
	 *		"urls":[
	 *			"file:///Volumes/Videos/DAM/HealthQuiz_Sitting.m4v",
	 *			"file:///Volumes/Videos/DAM/HealthQuiz_SmallestMuscle.m4v",
	 *			"file:///Volumes/Videos/DAM/HealthQuiz_Egg.m4v",
	 *		]	
	 *	}
	 *  
	 */
	function parseList(list) {
			tm_jsonList = JSON.parse(list);
			tm_urlList = tm_jsonList.urls
			tm_urlNumber = tm_urlList.length
			console.log("List size", tm_urlNumber);
	}
	/**
	 * Starts player if not already started
	 */

	function startPlayer(){
			if (tm_video.source == null) {
				addVideoSource(tm_video, tm_urlList[tm_currentVideo], 'video/mp4');
				playVideo(tm_currentVideo);
			}	
	}
	/**
	 * Retrieves playlist from remote location. Falls back to local playlist, otherwise
	 */	
	getPlaylist(tm_playlistRemoteUrl + '?cachebuster='+ new Date().getTime()).then((response) => {
			console.log("Using remote playlist");
			parseList(response);
			startPlayer();
		},(err) => {
			getPlaylist(tm_playlistLocalUrl + '?cachebuster='+ new Date().getTime()).then((response) => {
				console.log("Using local playlist");
				parseList(response);
				startPlayer();
			})
		});
		
	/**
	 * Load and play video
	 * @param  int index Video index
	 */
	function playVideo( index ) {
		tm_currentVideo = index;
		tm_source.src = tm_urlList[index]
		console.log('Playing video#', index, ', ', tm_urlList[index]);
		tm_video.load();
		tm_video.play();
	}

	/**
	 * Play next video
	 */		 
	tm_video.addEventListener( 'ended', function () {
		nextVideo = tm_currentVideo + 1;
		if ( nextVideo >= tm_urlNumber ) {
			nextVideo = 0;
		}
		playVideo( nextVideo );
	} );
} () );