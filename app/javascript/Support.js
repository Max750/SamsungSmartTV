var Support = {
		previousPageDetails : [],
		
		selectedItem : 0,
		topLeftItem : 0,
		isTopRow : true,
		
		//Scrolling Text's 
		startScroll : null,
		scroller : null,
		scrollpos : 0,
		resetToTop : null,
		
		//PageLoadingTime
		pageLoadedTime : null,
		
		//Screensaver
		screensaverVar : null,
		isScreensaverOn : true,
		
		clockVar : null
}

Support.clock = function() {
	var date = new Date();
    var h=date.getHours();
    var offset = File.getTVProperty("ClockOffset");
    h = h+offset;
	if (h<0) {h = h + 24;};
	if (h>23){h = h - 24;};
	if (h<10) {h = "0" + h;};
    var m=date.getMinutes(); 
	if (m<10) {m = "0" + m;};
	var time = h+':'+m;
	document.getElementById('Clock').innerHTML = time;
    document.getElementById('guiPlayer_clock').innerHTML = time;
    document.getElementById('guiPlayer_clock2').innerHTML = time;
    this.clockVar = setTimeout(function(){Support.clock();},900);
}

Support.logout = function() {

	//Turn off screensaver
	Support.screensaverOff();
	FileLog.write("User "+ Server.getUserName() + " logged out.");
	document.getElementById("menuUserImage").style.backgroundImage = "";
	document.getElementById("menuItems").innerHTML = "";
	Server.setUserID("");
	Server.setUserName("");
	Server.Logout();
	GuiUsers.start(false);
}

Support.updateHomePageURLs = function (title,url,title2Name,isURL1) {
	this.previousPageDetails[0][0] = "GuiPage_HomeTwoItems";

	if (isURL1 == true) {
		this.previousPageDetails[0][1] = title;
		this.previousPageDetails[0][2] = url;
	} else {
		this.previousPageDetails[0][3] = title;
		this.previousPageDetails[0][4] = url;
	}
	
	if (title2Name == "None") {
		this.previousPageDetails[0][0] = "GuiPage_HomeOneItem";
	}
}

Support.updateURLHistory = function(page,title,url,title2,url2,selectedItem,topLeftItem,isTop) {
	//Only add new page if going to new page (if url's are the same don't add) - Length must be greater than 0
	if (this.previousPageDetails.length > 0) {
		//If greater than 0 check if page isnt the same as previous page
		
		if (this.previousPageDetails[this.previousPageDetails.length-1][2] != url) {
			this.previousPageDetails.push([page,title,url,title2,url2,selectedItem,topLeftItem,isTop]);
			alert ("Adding new item: " + this.previousPageDetails.length);
		} else {
			if (this.previousPageDetails[this.previousPageDetails.length-1][0] != page) {
				//Required! Trust me dont remove this if!
				this.previousPageDetails.push([page,title,url,title2,url2,selectedItem,topLeftItem,isTop]);
				alert ("Adding new item: " + this.previousPageDetails.length);
			} else {
				alert ("New Item not added - Is duplicate of previous page: " + this.previousPageDetails.length);
			}		
		}
	} else {
		this.previousPageDetails.push([page,title,url,title2,url2,selectedItem,topLeftItem,isTop]);
		alert ("Adding new item: " + this.previousPageDetails.length);
	}
}

//Below method used for Main Menu & Playlist Deletion
Support.removeLatestURL = function() {
	this.previousPageDetails.pop();
	alert ("Removed item: " + this.previousPageDetails.length);
}

Support.removeAllURLs = function() {
	this.previousPageDetails.length = 0;
}
	
Support.processReturnURLHistory = function() {
	alert ("Just before removing item" + this.previousPageDetails.length);
	
	//Reset Help 
	document.getElementById("Help").style.visibility = "hidden";

	if (this.previousPageDetails.length > 0) {
		var array = this.previousPageDetails[this.previousPageDetails.length-1];
		var page = array[0];
		var title = array[1];
		var url = array[2];
		var title2 = array[3];
		var url2 = array[4];
		var selectedItem = array[5];
		var topLeftItem = array[6];
		var isTop = array[7];
		
		//Handle Navigation?
		switch (page) {
			case "GuiPage_HomeOneItem":
				GuiPage_HomeOneItem.start(title,url,selectedItem,topLeftItem);
				break;
			case "GuiPage_HomeTwoItems": 	
				GuiPage_HomeTwoItems.start(title,url,title2,url2,selectedItem,topLeftItem,isTop);
				break;	
			case "GuiDisplay_Series":
				GuiDisplay_Series.start(title,url,selectedItem,topLeftItem);
				break;
			case "GuiDisplay_Episodes":
				GuiDisplay_Episodes.start(title,url,selectedItem,topLeftItem);
				break;
			case "GuiDisplayOneItem":
				GuiDisplayOneItem.start(title,url,selectedItem,topLeftItem);
				break;
			case "GuiTV_Show":
				GuiTV_Show.start(title,url,selectedItem,topLeftItem);
				break;	
			case "GuiTV_Upcoming":
				GuiTV_Upcoming.start();
				break;		
			case "GuiPage_ItemDetails":
				GuiPage_ItemDetails.start(title,url,selectedItem);
				break;	
			case "GuiDisplayTwoItems": 	
				GuiDisplayTwoItems.start(title,url,title2,url2,selectedItem,topLeftItem,isTop);
				break;	
			case "GuiPage_MusicArtist": 	
				GuiPage_MusicArtist.start(title,url);
				break;
			case "GuiPage_MusicAZ": 	
				GuiPage_MusicAZ.start(title);//Not actually Title - Holds page!
				break;		
			case "GuiPage_Music": 	
				GuiPage_Music.start(title,url);
				break;	
			case "GuiPage_CastMember": 	
				GuiPage_CastMember.start(title,url,selectedItem,topLeftItem);
				break;
			case "GuiPage_Photos":
				GuiPage_Photos.start(title,url,selectedItem,topLeftItem);
				break;
			case "GuiPage_PhotoNavigation":
				GuiPage_PhotoNavigation.start(title,url,selectedItem,topLeftItem);
				break;	
			case "GuiPage_Playlist": //Params 3 = type, saved in url2, Param 4 = playlistid, saved as title2
				GuiPage_Playlist.start(title,url,title2,url2);
				break;	
			case "GuiPage_Search":
				GuiPage_Search.start(title,url);
				break;
			case "GuiPage_Settings": 	
				GuiPage_Settings.start();
				break;	
			default:
				break;
		}
		
		this.previousPageDetails.pop();
		
		alert ("Just after removing item" + this.previousPageDetails.length);
	} else {
		widgetAPI.sendReturnEvent();
	}
}

Support.destroyURLHistory = function() {
	this.previousPageDetails.length = 0;
}


Support.processIndexing = function(ItemsArray) {	
	var alphabet = "abcdefghijklmnopqrstuvwxyz";
	var currentLetter = 0;
	var indexLetter = [];
	var indexPosition = [];
	
	//Push non alphabetical chars onto index array
	var checkForNonLetter = ItemsArray[0].SortName.charAt(0).toLowerCase();	
	if (checkForNonLetter != 'a') {
		indexPosition.push(0);
		indexLetter.push('#');
	}
	
	for (var index = 0; index < ItemsArray.length; index++) {	
		var letter = ItemsArray[index].SortName.charAt(0).toLowerCase();	
		if (letter == alphabet.charAt(currentLetter-1)) {
			//If item is second or subsequent item with the same letter do nothing
		} else {
			//If Next Letter
			if (letter == alphabet.charAt(currentLetter)) {
				indexPosition.push(index);
				indexLetter.push(alphabet.charAt(currentLetter));
				currentLetter++;
			//Need to check as items may skip a letter (Bones , Downton Abbey) Above code would stick on C	
			} else {
				for (var alpha = currentLetter + 1; alpha < 26; alpha++) {										
					if (letter == alphabet.charAt(alpha)) {
						indexPosition.push(index);
						indexLetter.push(alphabet.charAt(alpha));
						currentLetter= currentLetter + ((alpha - currentLetter)+1);
						break;
					}	
				}
			}	
		}		
	}
	var returnArrays = [indexLetter, indexPosition];
	return  returnArrays;	
}

//-----------------------------------------------------------------------------------------------------------------------------------------

Support.updateDisplayedItems = function(Items,selectedItemID,startPos,endPos,DivIdUpdate,DivIdPrepend,isResume,Genre,showBackdrop) {
	var htmlToAdd = "";	
	for (var index = startPos; index < endPos; index++) {
		progress = Math.round((220 / 100) * Math.round(Items[index].UserData.PlayedPercentage));
		if (isResume == true) {
			//Calculate Width of Progress Bar
			if (Items[index].Type == "Episode") {
				var title = this.getNameFormat(Items[index].SeriesName, Items[index].ParentIndexNumber, Items[index].Name, Items[index].IndexNumber);		
				var imgsrc = "";
				if (Items[index].SeriesThumbImageTag) {
					title = this.getNameFormat("", Items[index].ParentIndexNumber, Items[index].Name, Items[index].IndexNumber);
					imgsrc = Server.getImageURL(Items[index].SeriesId,"Thumb",220,125,0,false);
				} else if (Items[index].ImageTags.Primary) {	
					imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false);
				} else {
					imgsrc = "images/collection.png";
				}
				//Add watched and favourite overlays.
				htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuProgressBar></div><div class=menuProgressBar_Current style='width:"+progress+"px;'></div>";
				if (Items[index].UserData.Played) {
					htmlToAdd += "<div class=genreItemCount>&#10003</div>";	
				}
				if (Items[index].UserData.IsFavorite) {
					htmlToAdd += "<div class=favItem></div>";
				}
				htmlToAdd += "<div class=menuItemWithProgress>" + title +"</div></div>";
	
			} else {
				var title = Items[index].Name;
				if (Items[index].ImageTags.Thumb) {		
					var imgsrc = Server.getImageURL(Items[index].Id,"Thumb",220,125,Items[index].UserData.PlayCount,Items[index].UserData.Played);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuProgressBar></div><div class=menuProgressBar_Current style='width:"+progress+"px;'></div><div class=menuItemWithProgress></div></div>";	
				} else if (Items[index].BackdropImageTags.length > 0) {	
					var imgsrc = Server.getImageURL(Items[index].Id,"Backdrop",220,125,Items[index].UserData.PlayCount,Items[index].UserData.Played);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuProgressBar></div><div class=menuProgressBar_Current style='width:"+progress+"px;'></div><div class=menuItemWithProgress>"+ title + "</div></div>";	
				} else if (Items[index].ImageTags.Primary) {		
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuProgressBar></div><div class=menuProgressBar_Current style='width:"+progress+"px;'></div><div class=menuItemWithProgress>"+ title + "</div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(images/collection.png)><div class=menuProgressBar></div><div class=menuProgressBar_Current style='width:"+progress+"px;'></div><div class=menuItemWithProgress>"+ title + "</div></div>";
				}
			}			
		} else {
			//----------------------------------------------------------------------------------------------
			if (Items[index].Type == "Genre") {	
				if (Items[index].ImageTags.Primary) {
					var imgsrc = (File.getUserProperty("LargerView") == true) ? Server.getImageURL(Items[index].Id,"Primary",119,178,0,false,0) : Server.getImageURL(Items[index].Id,"Primary",96,140,0,false,0); 
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);></div>";
				}
			//----------------------------------------------------------------------------------------------
			} else if (Items[index].Type == "Episode") {
				var title = this.getNameFormat(Items[index].SeriesName, Items[index].ParentIndexNumber, Items[index].Name, Items[index].IndexNumber);	
				
				var imageData = "";	
				if (Items[index].SeriesThumbImageTag) {	
					var imgsrc = Server.getImageURL(Items[index].SeriesId,"Thumb",220,125,0,Items[index].UserData.Played,0);
					imageData = "background-image:url(" +imgsrc+ ")";
					title = this.getNameFormat("", Items[index].ParentIndexNumber, Items[index].Name, Items[index].IndexNumber);
				} else 	if (Items[index].ImageTags.Primary) {	
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,Items[index].UserData.Played,0);	
					imageData = "background-image:url(" +imgsrc+ ")";
				} else {
					imageData = "background-color:rgba(0,0,0,0.5)";
				}
				htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style="+imageData+">";
				//Add overlays.
				if (Items[index].LocationType == "Virtual"){
					var imageMissingOrUnaired = (Support.FutureDate(Items[index].PremiereDate) == true) ? "ShowListSingleUnaired" : "ShowListSingleMissing";
					htmlToAdd += "<div class='"+imageMissingOrUnaired+"'></div>";
				}
				if (Items[index].UserData.Played) {
					htmlToAdd += "<div class=genreItemCount>&#10003</div>";	
				}
				if (Items[index].UserData.IsFavorite) {
					htmlToAdd += "<div class=favItem></div>";
				}
				htmlToAdd += "<div class=menuItem>"+ title + "</div></div>";	
			//----------------------------------------------------------------------------------------------
			} else if (Items[index].Type == "MusicAlbum"){
				var title = Items[index].Name;		
				if (Items[index].ImageTags.Primary) {		
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",112,112,Items[index].UserData.PlayCount,false,0);
					if (Items[index].UserData.IsFavorite) {
						htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=favItem></div><div class=genreItemCount>"+Items[index].RecursiveItemCount+"</div><div class=menuItem>"+ title + "</div></div>";
					} else {
						htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=genreItemCount>"+Items[index].RecursiveItemCount+"</div><div class=menuItem>"+ title + "</div></div>";	
					}	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(images/album.png)><div class=genreItemCount>"+Items[index].RecursiveItemCount+"</div><div class=menuItem>"+ title + "</div></div>";
				} 
			//----------------------------------------------------------------------------------------------
			}  else if (Items[index].Type == "MusicArtist"){
				var title = Items[index].Name;		
				var count = Items[index].SongCount;
				
				if (Items[index].ImageTags.Primary) {			
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",112,112,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=genreItemCount>"+count+"</div><div class=menuItem>"+ title + "</div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(images/artist.png)><div class=genreItemCount>"+count+"</div><div class=menuItem>"+ title + "</div></div>";
				}
			//----------------------------------------------------------------------------------------------
			} else if (Items[index].Type == "Audio"){
				var title = Items[index].Name;
				if (Items[index].AlbumPrimaryImageTag) {	
					var imgsrc = Server.getImageURL(Items[index].AlbumId,"Primary",112,112,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(images/album.png)><div class=menuItem>"+ title + "</div></div>";
				}
			//----------------------------------------------------------------------------------------------
			} else if (Items[index].Type == "Series" || Items[index].Type == "Movie" || Items[index].Type == "BoxSet") {
				//alert(Items[index].Type+": "+Items[index].Name);
				var title = Items[index].Name;
				if (showBackdrop == true) {
					if (Items[index].ImageTags.Thumb) {		
						var imgsrc = Server.getImageURL(Items[index].Id,"Thumb",220,125,0,false,0);
						htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")>";
					} else if (Items[index].BackdropImageTags.length > 0) {
						var imgsrc = Server.getBackgroundImageURL(Items[index].Id,"Backdrop",220,125,0,false,0,Items[index].BackdropImageTags.length);
						htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div>";
					} else if (Items[index].ImageTags.Primary) {		
						var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
						htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div>";
					} else {
						htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style='background-color:rgba(0,0,0,0.5);'><div class=menuItem>"+ title + "</div>";				
					}
				} else {
					if (Items[index].ImageTags.Primary) {
						var imgsrc = (File.getUserProperty("LargerView") == true) ? Server.getImageURL(Items[index].Id,"Primary",121,178,0,false,0) : Server.getImageURL(Items[index].Id,"Primary",96,140,0,false,0); 
						htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")>";
					} else if (Items[index].ImageTags.Primary) {		
						var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
						htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div>";
					} else {
						htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style='background-color:rgba(0,0,0,0.5);'><div class=menuItem>"+ title + "</div>";				
					}
				}
				//Add watched and favourite overlays.
				if (Items[index].UserData.Played) {
					htmlToAdd += "<div class=genreItemCount>&#10003</div>";	
				} else if (Items[index].UserData.UnplayedItemCount > 0){
					htmlToAdd += "<div class=genreItemCount>"+Items[index].UserData.UnplayedItemCount+"</div>";
				}
				if (Items[index].UserData.IsFavorite) {
					htmlToAdd += "<div class=favItem></div>";
				}
				htmlToAdd += "</div>";
			//----------------------------------------------------------------------------------------------	
			} else if (Items[index].Type == "TvChannel") {
				var title = Items[index].Name;		
				if (Items[index].ImageTags.Primary) {			
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);><div class=menuItem>"+ title + "</div></div>";
				}
			//----------------------------------------------------------------------------------------------
			} else if (Items[index].Type == "Season") {
				if (Items[index].BackdropImageTags.length > 0) {			
					var imgsrc = Server.getBackgroundImageURL(Items[index].Id,"Primary",114,165,Items[index].UserData.PlayCount,Items[index].UserData.Played,Items[index].UserData.PlayedPercentage,Items[index].BackdropImageTags.length);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);></div>";
				}
			//----------------------------------------------------------------------------------------------
			} else if (Items[index].Type == "Channel") {
				var title = Items[index].Name;	 
				if (Items[index].BackdropImageTags.length > 0) {			
					var imgsrc = Server.getBackgroundImageURL(Items[index].Id,"Backdrop",220,125,0,false,0,Items[index].BackdropImageTags.length);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				}
				else if (Items[index].ImageTags.Thumb) {		
					var imgsrc = Server.getImageURL(Items[index].Id,"Thumb",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";
				}
				else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);><div class=menuItem>"+ title + "</div></div>";
				}
			//----------------------------------------------------------------------------------------------
			} else if (Items[index].Type == "ChannelFolderItem") {
				var title = Items[index].Name;		
				if (Items[index].ImageTags.Primary) {			
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);><div class=menuItem>"+ title + "</div></div>";
				}
			//----------------------------------------------------------------------------------------------
			} else if (Items[index].Type == "ChannelVideoItem") {
				var title = Items[index].Name;		
				if (Items[index].ImageTags.Primary) {			
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);><div class=menuItem>"+ title + "</div></div>";
				}
			//----------------------------------------------------------------------------------------------
			} else if (Items[index].Type == "Playlist" || Items[index].Type == "CollectionFolder" ) {
				var title = Items[index].Name;	
				if (Items[index].ImageTags.Primary) {			
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else if (Items[index].ImageTags.Thumb) {			
					var imgsrc = Server.getImageURL(Items[index].Id,"Thumb",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else if (Items[index].BackdropImageTags.length > 0) {			
					var imgsrc = Server.getBackgroundImageURL(Items[index].Id,"Backdrop",220,125,0,false,0,Items[index].BackdropImageTags.length);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);><div class=menuItem>"+ title + "</div></div>";
				}
			//----------------------------------------------------------------------------------------------
			}  else if (Items[index].Type == "Photo") {
				var title = Items[index].Name;		
				if (Items[index].ImageTags.Primary) {			
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem></div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);><div class=menuItem>"+ title + "</div></div>";
				}
			//----------------------------------------------------------------------------------------------
			}  else if (Items[index].Type == "Folder") {
				var title = Items[index].Name;
				if (Items[index].ImageTags.Thumb) {		
					var imgsrc = Server.getImageURL(Items[index].Id,"Thumb",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";
				} else if (Items[index].ImageTags.Primary) {			
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
/*				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);><div class=menuItem>"+ title + "</div></div>";*/
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);background-image:url(images/EmptyFolder-75x61.png)><div class=menuItem>"+ title + "</div></div>";
				}
			//----------------------------------------------------------------------------------------------
			}  else if (Items[index].Type == "PhotoAlbum") {
				var title = Items[index].Name;		
				if (Items[index].ImageTags.Thumb) {		
					var imgsrc = Server.getImageURL(Items[index].Id,"Thumb",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";
				} else if (Items[index].ImageTags.Primary) {			
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);><div class=menuItem>"+ title + "</div></div>";
				}
			//----------------------------------------------------------------------------------------------
			} else if (Items[index].Type == "Video") {
				var title = Items[index].Name;	
				if (Items[index].ImageTags.Primary) {			
					var imgsrc = Server.getImageURL(Items[index].Id,"Primary",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else if (Items[index].ImageTags.Thumb) {		
					var imgsrc = Server.getImageURL(Items[index].Id,"Thumb",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";
				} else if (Items[index].BackdropImageTags.length > 0) {			
					var imgsrc = Server.getBackgroundImageURL(Items[index].Id,"Backdrop",220,125,0,false,0,Items[index].BackdropImageTags.length);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);><div class=menuItem>"+ title + "</div></div>";
				}			
			//----------------------------------------------------------------------------------------------
			} else {
				alert("Unhandled Item type: "+Items[index].Type)
				var title = Items[index].Name;		
				if (Items[index].ImageTags.Thumb) {		
					var imgsrc = Server.getImageURL(Items[index].Id,"Thumb",220,125,0,false,0);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";
				} else if (Items[index].BackdropImageTags.length > 0) {			
					var imgsrc = Server.getBackgroundImageURL(Items[index].Id,"Backdrop",220,125,0,false,0,Items[index].BackdropImageTags.length);
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-image:url(" +imgsrc+ ")><div class=menuItem>"+ title + "</div></div>";	
				} else {
					htmlToAdd += "<div id="+ DivIdPrepend + Items[index].Id + " style=background-color:rgba(0,0,0,0.5);><div class=menuItem>"+ title + "</div></div>";
				}			
			}	 	
		}
    }
	document.getElementById(DivIdUpdate).innerHTML = htmlToAdd;
}

Support.updateOneDisplayedItem = function(item,DivIdPrepend,isResume,Genre,showBackdrop,sendingPage,updateImages) {
	var imgsrc = "";
	var backgroundColor = "";
	var innerHTML = "";
	progress = Math.round((220 / 100) * Math.round(item.UserData.PlayedPercentage));
	if (isResume == true) {
		//Calculate Width of Progress Bar
		if (item.Type == "Episode") {
			alert("Update a "+item.Type + "with progress.");
			var title = this.getNameFormat(item.SeriesName, item.ParentIndexNumber, item.Name, item.IndexNumber);		
			if (item.SeriesThumbImageTag) {
				title = this.getNameFormat("", item.ParentIndexNumber, item.Name, item.IndexNumber);
				imgsrc = Server.getImageURL(item.SeriesId,"Thumb",220,125,0,false);
			} else if (item.ImageTags.Primary) {	
				imgsrc = Server.getImageURL(item.Id,"Primary",220,125,0,false);
			} else {
				imgsrc = "images/collection.png";
			}
			innerHTML += "<div class=menuProgressBar></div><div class=menuProgressBar_Current style='width:"+progress+"px;'></div>";
			//Add watched and favourite overlays.
			if (item.UserData.Played) {
				innerHTML += "<div class=genreItemCount>&#10003</div>";	
			}
			if (item.UserData.IsFavorite) {
				innerHTML += "<div class=favItem></div>";
			}
			innerHTML += "<div class=menuItemWithProgress>" + title +"</div>";
		} else {
			alert("Update a "+item.Type + "with progress.");
			var title = item.Name;
			if (item.ImageTags.Thumb) {		
				imgsrc = Server.getImageURL(item.Id,"Thumb",220,125,item.UserData.PlayCount,item.UserData.Played); 
				innerHTML += "<div class=menuProgressBar></div><div class=menuProgressBar_Current style='width:"+progress+"px;'></div><div class=menuItemWithProgress></div>";	
			} else if (item.BackdropImageTags.length > 0) {	
				imgsrc = Server.getImageURL(item.Id,"Backdrop",220,125,item.UserData.PlayCount,item.UserData.Played);
				innerHTML += "<div id="+ DivIdPrepend + item.Id + " style=background-image:url(" +imgsrc+ ")><div class=menuProgressBar></div><div class=menuProgressBar_Current style='width:"+progress+"px;'></div><div class=menuItemWithProgress>"+ title + "</div>";	
			} else {
				imgsrc = "images/collection.png";
				innerHTML += "<div class=menuProgressBar></div><div class=menuProgressBar_Current style='width:"+progress+"px;'></div><div class=menuItemWithProgress>"+ title + "</div>";
			}
		}			
	} else {
		if (item.Type == "Genre") {	
			alert("Update a "+item.Type);
			var itemCount = 0;
			switch (Genre) {
			case "Movie":
				itemCount = item.MovieCount;
				break;
			case "Series":
				itemCount = item.SeriesCount;
				break;
			default:
				break;
			}
			if (item.ImageTags.Primary) {
				imgsrc = (File.getUserProperty("LargerView") == true) ? Server.getImageURL(item.Id,"Primary",119,178,0,false,0) : Server.getImageURL(item.Id,"Primary",96,140,0,false,0); 
				innerHTML += "<div class=genreItemCount>"+itemCount+"</div>";	
			} else {
				backgroundColor = "rgba(0,0,0,0.5)";
				innerHTML += "<div class=genreItemCount>"+itemCount+"</div>";
			}
		//----------------------------------------------------------------------------------------------
		} else if (item.Type == "Episode" && sendingPage == "GuiDisplay_Episodes") {
			alert("Update a "+item.Type);
			var title = "";
			if (item.IndexNumber === undefined) {
				title = item.Name;
			} else {
				title = item.IndexNumber + " - " + item.Name;
			}
			
			innerHTML += "<div id=" + item.Id + " class='EpisodeListSingle'>";
			
			if (item.ImageTags.Primary) {			
				var epImgsrc = Server.getImageURL(item.Id,"Primary",100,46,0,false,0);
				innerHTML += "<div class='EpisodeListSingleImage' style=background-image:url(" +epImgsrc+ ")></div>";
			} else {
				innerHTML += "<div class='EpisodeListSingleImage'></div>";
			}
			
			innerHTML += "<div id=title_" + item.Id;
			
			if (item.UserData.Played == true) {
				innerHTML += " class='EpisodeListSingleTitleWatched'>"+ title +"</div>";
			}else if (item.LocationType == "Virtual"){
				innerHTML += " class='EpisodeListSingleTitleVirtual'>"+ title +"</div>";
			} else {
				innerHTML += " class='EpisodeListSingleTitle'>"+ title +"</div>";
			}
			if (item.UserData.IsFavorite == true) {
				innerHTML += "<div class='ShowListSingleFav'></div>";
			}
			if (item.UserData.Played == true) {
				innerHTML += "<div class='ShowListSingleWatched'></div>";
			}else if (item.LocationType == "Virtual"){
				innerHTML += "<div class='"+imageMissingOrUnaired+"'></div>";
			}
			innerHTML += "</div>";
		//----------------------------------------------------------------------------------------------
		} else if (item.Type == "Episode") {
			alert("Update a "+item.Type);
			var title = this.getNameFormat(item.SeriesName, item.ParentIndexNumber, item.Name, item.IndexNumber);	
			if (item.SeriesThumbImageTag) {	
				imgsrc = Server.getImageURL(item.SeriesId,"Thumb",220,125,0,item.UserData.Played,0);
				title = this.getNameFormat("", item.ParentIndexNumber, item.Name, item.IndexNumber);
			} else 	if (item.ImageTags.Primary) {	
				imgsrc = Server.getImageURL(item.Id,"Primary",220,125,0,item.UserData.Played,0);	
			} else {
				backgroundColor = "rgba(0,0,0,0.5)";
			}
			//Add watched and favourite overlays.
			if (item.UserData.Played) {
				innerHTML += "<div class=genreItemCount>&#10003</div>";	
			}
			if (item.UserData.IsFavorite) {
				innerHTML += "<div class=favItem></div>";
			}
			innerHTML += "<div class=menuItem>"+ title + "</div>";
		//----------------------------------------------------------------------------------------------
		} else if (item.Type == "MusicAlbum"){
			alert("Update a "+item.Type);
			var title = item.Name;		
			if (item.ImageTags.Primary) {		
				imgsrc = Server.getImageURL(item.Id,"Primary",112,112,item.UserData.PlayCount,false,0);
				if (item.UserData.IsFavorite) {
					innerHTML += "<div class=favItem></div><div class=genreItemCount>"+item.RecursiveItemCount+"</div><div class=menuItem>"+ title + "</div>";
				} else {
					innerHTML += "<div class=genreItemCount>"+item.RecursiveItemCount+"</div><div class=menuItem>"+ title + "</div>";	
				}	
			} else {
				imgsrc = "images/album.png";
				innerHTML += "<div class=genreItemCount>"+item.RecursiveItemCount+"</div><div class=menuItem>"+ title + "</div>";
			} 
		//----------------------------------------------------------------------------------------------
		}  else if (item.Type == "MusicArtist"){
			alert("Update a "+item.Type);
			var title = item.Name;		
			var count = item.SongCount;
			
			if (item.ImageTags.Primary) {			
				imgsrc = Server.getImageURL(item.Id,"Primary",112,112,0,false,0);
				innerHTML += "<div class=genreItemCount>"+count+"</div><div class=menuItem>"+ title + "</div>";	
			} else {
				imgsrc = "images/artist.png";
				innerHTML += "<div class=genreItemCount>"+count+"</div><div class=menuItem>"+ title + "</div>";
			} 
		//----------------------------------------------------------------------------------------------
		} else if (item.Type == "Audio"){
			alert("Update a "+item.Type);
			var title = item.Name;
			if (item.AlbumPrimaryImageTag) {	
				imgsrc = Server.getImageURL(item.AlbumId,"Primary",112,112,0,false,0);
				innerHTML += "<div class=menuItem>"+ title + "</div>";	
			} else {
				imgsrc = "images/album.png";
				innerHTML += "<div class=menuItem>"+ title + "</div>";
			}
		//----------------------------------------------------------------------------------------------
		} else if (item.Type == "Series" || item.Type == "Movie" || item.Type == "BoxSet") {
			alert("Update a "+item.Type);
			var title = item.Name;
			if (showBackdrop == true) {
				if (item.ImageTags.Thumb) {		
					imgsrc = Server.getImageURL(item.Id,"Thumb",220,125,0,false,0);
				} else if (item.BackdropImageTags.length > 0) {
					imgsrc = Server.getBackgroundImageURL(item.Id,"Backdrop",220,125,0,false,0,item.BackdropImageTags.length);
					innerHTML += "<div class=menuItem>"+ title + "</div>";
				} else {
					backgroundColor = "rgba(0,0,0,0.5)";
					innerHTML += "<div class=menuItem>"+ title + "</div>";				
				}
			} else {
				if (item.ImageTags.Primary) {
					imgsrc = (File.getUserProperty("LargerView") == true) ? Server.getImageURL(item.Id,"Primary",119,178,0,false,0) : Server.getImageURL(item.Id,"Primary",96,140,0,false,0); 
				} else {
					backgroundColor = "rgba(0,0,0,0.5)";
					innerHTML += "<div class=menuItem>"+ title + "</div>";				
				}
			}
			//Add watched and favourite overlays.
			if (item.UserData.Played) {
				innerHTML += "<div class=genreItemCount>&#10003</div>";	
			} else if (item.UserData.UnplayedItemCount > 0){
				innerHTML += "<div class=genreItemCount>"+item.UserData.UnplayedItemCount+"</div>";
			}
			if (item.UserData.IsFavorite) {
				innerHTML += "<div class=favItem></div>";
			}
		//----------------------------------------------------------------------------------------------
		} else if (item.Type == "TvChannel") {
			alert("Update a "+item.Type);
			var title = item.Name;		
			if (item.ImageTags.Primary) {			
				imgsrc = Server.getImageURL(item.Id,"Primary",220,125,0,false,0);
				innerHTML += "<div class=menuItem>"+ title + "</div>";	
			} else {
				backgroundColor = "rgba(0,0,0,0.5)";
				innerHTML += "<div class=menuItem>"+ title + "</div>";
			} 
		} else if (item.Type == "Season") {
			if (item.BackdropImageTags.length > 0) {			
				imgsrc = Server.getBackgroundImageURL(item.Id,"Primary",114,165,item.UserData.PlayCount,item.UserData.Played,item.UserData.PlayedPercentage,item.BackdropImageTags.length);
			} else {
				backgroundColor = "rgba(0,0,0,0.5)";
			}
		//----------------------------------------------------------------------------------------------
		} else if (item.Type == "Channel") {
			alert("Update a "+item.Type);
			var title = item.Name;	 
			if (item.BackdropImageTags.length > 0) {			
				imgsrc = Server.getBackgroundImageURL(item.Id,"Backdrop",220,125,0,false,0,item.BackdropImageTags.length);
				innerHTML += "<div class=menuItem>"+ title + "</div>";	
			}
			else if (item.ImageTags.Thumb) {		
				imgsrc = Server.getImageURL(item.Id,"Thumb",220,125,0,false,0);
				innerHTML += "<div class=menuItem>"+ title + "</div>";
			}
			else {
				backgroundColor = "rgba(0,0,0,0.5)";
				innerHTML += "<div class=menuItem>"+ title + "</div>";
			}
		//----------------------------------------------------------------------------------------------
		} else if (item.Type == "ChannelFolderItem") {
			alert("Update a "+item.Type);
			var title = item.Name;		
			if (item.ImageTags.Primary) {			
				imgsrc = Server.getImageURL(item.Id,"Primary",220,125,0,false,0);
				innerHTML += "<div class=menuItem>"+ title + "</div>";	
			} else {
				backgroundColor = "rgba(0,0,0,0.5)";
				innerHTML += "<div class=menuItem>"+ title + "</div>";
			}
		//----------------------------------------------------------------------------------------------
		} else if (item.Type == "ChannelVideoItem") {
			alert("Update a "+item.Type);
			var title = item.Name;		
			if (item.ImageTags.Primary) {			
				imgsrc = Server.getImageURL(item.Id,"Primary",220,125,0,false,0);
				innerHTML += "<div class=menuItem>"+ title + "</div>";	
			} else {
				backgroundColor = "rgba(0,0,0,0.5)";
				innerHTML += "<div class=menuItem>"+ title + "</div>";
			}
		//----------------------------------------------------------------------------------------------
		} else if (item.Type == "Playlist" || item.Type == "CollectionFolder" ) {
			alert("Update a "+item.Type);
			var title = item.Name;	
			if (item.ImageTags.Primary) {			
				imgsrc = Server.getImageURL(item.Id,"Primary",220,125,0,false,0);
				innerHTML += "<div class=menuItem>"+ title + "</div>";	
			} else if (item.ImageTags.Thumb) {			
				imgsrc = Server.getImageURL(item.Id,"Thumb",220,125,0,false,0);
				innerHTML += "<div class=menuItem>"+ title + "</div>";	
			} else if (item.BackdropImageTags.length > 0) {			
				imgsrc = Server.getBackgroundImageURL(item.Id,"Backdrop",220,125,0,false,0,item.BackdropImageTags.length);
				innerHTML += "<div class=menuItem>"+ title + "</div>";	
			} else {
				backgroundColor = "rgba(0,0,0,0.5)";
				innerHTML += "<div class=menuItem>"+ title + "</div>";
			}
		//----------------------------------------------------------------------------------------------
		}  else if (item.Type == "Photo") {
			alert("Update a "+item.Type);
			var title = item.Name;		
			if (item.ImageTags.Primary) {			
				imgsrc = Server.getImageURL(item.Id,"Primary",220,125,0,false,0);
				innerHTML += "<div class=menuItem>"+ title + "</div>";	
			} else {
				backgroundColor = "rgba(0,0,0,0.5)";
				innerHTML += "<div class=menuItem>"+ title + "</div>";
			} 
		//----------------------------------------------------------------------------------------------
		} else {
			alert("Update a "+item.Type);
			var title = item.Name;		
			if (item.ImageTags.Thumb) {		
				imgsrc = Server.getImageURL(item.Id,"Thumb",220,125,0,false,0);
				innerHTML += "<div class=menuItem>"+ title + "</div>";
			} else if (item.BackdropImageTags.length > 0) {			
				imgsrc = Server.getBackgroundImageURL(item.Id,"Backdrop",220,125,0,false,0,item.BackdropImageTags.length);
				innerHTML += "<div class=menuItem>"+ title + "</div>";	
			} else {
				backgroundColor = "rgba(0,0,0,0.5)";
				innerHTML += "<div class=menuItem>"+ title + "</div>";
			}			
		}	 	
	}
	var divId = DivIdPrepend + item.Id;
	if (updateImages){
		document.getElementById(divId).style.backgroundImage = "url(" +imgsrc+ ")";
	}
	if (backgroundColor){
		document.getElementById(divId).style.backgroundColor = backgroundColor;
	}
	if (innerHTML){
		document.getElementById(divId).innerHTML = innerHTML;
	}	
}

//-----------------------------------------------------------------------------------------------------------------------------------------

Support.getNameFormat = function(SeriesName, SeriesNo, EpisodeName, EpisodeNo) {
	 if (File.getUserProperty("SeasonLabel")){
		 if (SeriesName == "" || SeriesName == null) {
				if (SeriesNo !== undefined && EpisodeNo !== undefined) {
					
					var seasonNumber = SeriesNo;
					var seasonString = "";
					if (seasonNumber < 10){
						seasonString = "0" + seasonNumber;
					}
					else{
						seasonString = seasonNumber;
					}
					
					var episodeNumber = EpisodeNo;
					var episodeString = "";
					if (episodeNumber < 10){
						episodeString = "0" + episodeNumber;
					}
					else{
						episodeString = episodeNumber;
					}
					
					if (EpisodeName == "" || EpisodeName == null) {
						return "S" + seasonString + "E" + episodeString;	
					} else {
						return "S" + seasonString + "E" + episodeString + " - " + EpisodeName;	
					}	
				} else {
					return EpisodeName;
				}
			} else {
				if (SeriesNo !== undefined && EpisodeNo !== undefined) {
					var seasonNumber = SeriesNo;
					var seasonString = "";
					if (seasonNumber < 10){
						seasonString = "0" + seasonNumber;
					}
					else{
						seasonString = seasonNumber;
					}
					
					var episodeNumber = EpisodeNo;
					var episodeString = "";
					if (episodeNumber < 10){
						episodeString = "0" + episodeNumber;
					}
					else{
						episodeString = episodeNumber;
					}

					return SeriesName + "<br>S" + seasonString + "E" + episodeString + " - " + EpisodeName;		
				} else {
					return SeriesName + "<br>"+EpisodeName;
				}
			}
	 }else{
		 if (SeriesName == "" || SeriesName == null) {
				if (SeriesNo !== undefined && EpisodeNo !== undefined) {					
					if (EpisodeName == "" || EpisodeName == null) {
						return "S" + SeriesNo + ",E" + EpisodeNo;	
					} else {
						return "S" + SeriesNo + ",E" + EpisodeNo + " - " + EpisodeName;	
					}	
				} else {
					return EpisodeName;
				}
			} else {
				if (SeriesNo !== undefined && EpisodeNo !== undefined) {
					return SeriesName + "<br>S" + SeriesNo + ",E" + EpisodeNo + " - " + EpisodeName;		
				} else {
					return SeriesName + "<br>"+EpisodeName;
				}
			}
	 }
	
	
}

//-----------------------------------------------------------------------------------------------------------------------------------------

//ByPass Counter required for views that have 2 lists (Like Home Page) so I only display the counter of the active list
Support.updateSelectedNEW = function(Array,selectedItemID,startPos,endPos,strIfSelected,strIfNot,DivIdPrepend,dontUpdateCounter,totalRecordCount) {
	for (var index = startPos; index < endPos; index++){	
		if (index == selectedItemID) {
			document.getElementById(DivIdPrepend + Array[index].Id).className = strIfSelected;			
		} else {	
			document.getElementById(DivIdPrepend + Array[index].Id).className = strIfNot;		
		}			
    }
	
	//Update Counter DIV
	if (dontUpdateCounter == true) { //Done like this so it will process null		
	} else {
		if (Array.length == 0) {
			document.getElementById("Counter").innerHTML = "";
		} else {
			if (totalRecordCount !== undefined || totalRecordCount != null) { 
				document.getElementById("Counter").innerHTML = (selectedItemID + 1) + "/" + totalRecordCount;
			} else {
				document.getElementById("Counter").innerHTML = (selectedItemID + 1) + "/" + Array.length;
			}	
		}	
	}	
}

//-----------------------------------------------------------------------------------------------------------------------------------------

Support.processSelectedItem = function(page,ItemData,startParams,selectedItem,topLeftItem,isTop,genreType,isLatest) {	
	if (page == "GuiPage_HomeTwoItems") {
		Support.updateURLHistory(page,startParams[0],startParams[1],startParams[2],startParams[3],selectedItem,topLeftItem,isTop);
	} else {
		if (startParams == null) {
			Support.updateURLHistory(page,null,null,null,null,selectedItem,topLeftItem,null);
		} else {
			Support.updateURLHistory(page,startParams[0],startParams[1],null,null,selectedItem,topLeftItem,null);
		}
		
	}
	if (ItemData.Items[selectedItem].CollectionType != null) {
		alert("CollectionType: "+ItemData.Items[selectedItem].CollectionType);
		switch (ItemData.Items[selectedItem].CollectionType) {
		case "boxsets":	
			//URL Below IS TEMPORARY TO GRAB SERIES OR FILMS ONLY - IN FUTURE SHOULD DISPLAY ALL
			var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
			GuiDisplay_Series.start("All Collections",url,0,0);
			break;
		case "tvshows" :	
			var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Series&Recursive=true&CollapseBoxSetItems=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
			GuiDisplay_Series.start("All TV",url,0,0);
			break;
		case "movies" :
			var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Movie&Recursive=true&CollapseBoxSetItems=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
			GuiDisplay_Series.start("All Movies",url,0,0);
			break;	
		case "music" :
			if (Main.isMusicEnabled()) {			
				var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&IncludeItemTypes=MusicAlbum&Recursive=true&ExcludeLocationTypes=Virtual&fields=ParentId,SortName&CollapseBoxSetItems=false");
				GuiDisplay_Series.start("Album Music",url,0,0);
			} else {
				Support.removeLatestURL();
			}
			break;
		case "photos" :
			var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&SortBy=SortName&SortOrder=Ascending&fields=PrimaryImageAspectRatio,SortName");
			GuiPage_Photos.start(ItemData.Items[selectedItem].Name,url,0,0);
			break;
		case "playlists":
			var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&SortBy=SortName&SortOrder=Ascending&fields=SortName");
			GuiDisplayOneItem.start(ItemData.Items[selectedItem].Name,url,0,0);
			break;	
		default:
			var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&SortBy=SortName&SortOrder=Ascending&fields=PrimaryImageAspectRatio,SortName");
			if (page == "GuiPage_Photos"){
				GuiPage_Photos.start(ItemData.Items[selectedItem].Name,url,0,0);
			} else {
				GuiDisplayOneItem.start(ItemData.Items[selectedItem].Name,url,0,0);
			}
			break;
		}
	} else {
		alert("Type: "+ItemData.Items[selectedItem].Type);
		switch (ItemData.Items[selectedItem].Type) {
		case "ManualCollectionsFolder":
			var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
			GuiDisplay_Series.start("All Collections",url,0,0);
			break;
		case "BoxSet":
			var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
			GuiDisplay_Series.start("All Collections",url,0,0);
			break;
		case "Series":
			//Is Latest Items Screen - If so skip to Episode view of latest episodes
			if (isLatest) {
				var url = Server.getCustomURL("/Shows/" + ItemData.Items[selectedItem].Id +  "/Episodes?format=json&userId=" + Server.getUserID() + "&isPlayed=false&IsFolder=false&GroupItems=false&fields=SortName,Overview,Genres,RunTimeTicks");
				GuiDisplay_Episodes.start("New TV",url,0,0);
			} else {
				var url = Server.getItemInfoURL(ItemData.Items[selectedItem].Id,null);
				GuiTV_Show.start(ItemData.Items[selectedItem].Name,url,0,0);
			}
			break;		
		case "Movie":
			var url = Server.getItemInfoURL(ItemData.Items[selectedItem].Id,null);
			GuiPage_ItemDetails.start(ItemData.Items[selectedItem].Name,url,0);
			break;	
		case "Episode":
			var url = Server.getItemInfoURL(ItemData.Items[selectedItem].Id,null);
			GuiPage_ItemDetails.start(ItemData.Items[selectedItem].Name,url,0);
			break;
		case "Genre":
			var url = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes="+genreType+"&Recursive=true&CollapseBoxSetItems=false&fields=ParentId,SortName,Overview,RunTimeTicks&Genres=" + ItemData.Items[selectedItem].Name);
			var name = (genreType == "Series") ? "Genre TV" : "Genre Movies";
			GuiDisplay_Series.start(name, url,0,0);		
			break;
		case "MusicArtist":	
			var artist = ItemData.Items[selectedItem].Name.replace(/ /g, '+');	 
			artist = artist.replace(/&/g, '%26');	
			var url = Server.getItemTypeURL("&SortBy=Album%2CSortName&SortOrder=Ascending&IncludeItemTypes=Audio&Recursive=true&CollapseBoxSetItems=false&Artists=" + artist);
			GuiPage_Music.start(ItemData.Items[selectedItem].Name,url,ItemData.Items[selectedItem].Type);
			break;	
		case "MusicAlbum":	
			var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Audio&Recursive=true&CollapseBoxSetItems=false");
			GuiPage_Music.start(ItemData.Items[selectedItem].Name,url,ItemData.Items[selectedItem].Type);
			break;	
		case "Folder":
		case "PhotoAlbum":
		case "CollectionFolder":	
			var url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&SortBy=SortName&SortOrder=Ascending&fields=PrimaryImageAspectRatio,SortName,ParentId");
			if (page == "GuiPage_Photos"){
				GuiPage_Photos.start(ItemData.Items[selectedItem].Name,url,0,0);
			} else {
				GuiDisplayOneItem.start(ItemData.Items[selectedItem].Name,url,0,0);
			}
			break;
		case "Channel":
			var url = Server.getCustomURL("/Channels/"+ItemData.Items[selectedItem].Id+"/Items?userId="+Server.getUserID()+"&fields=SortName&format=json");	
			GuiDisplayOneItem.start(ItemData.Items[selectedItem].Name,url,0,0);
			break;
		case "ChannelFolderItem":
			var url = Server.getCustomURL("/Channels/"+ItemData.Items[selectedItem].ChannelId+"/Items?userId="+Server.getUserID()+"&folderId="+ItemData.Items[selectedItem].Id+"&fields=SortName&format=json");	
			GuiDisplayOneItem.start(ItemData.Items[selectedItem].Name,url,0,0);
			break;	
		case "Playlist":
			var url = Server.getCustomURL("/Playlists/"+ItemData.Items[selectedItem].Id+"/Items?userId="+Server.getUserID()+"&fields=SortName&SortBy=SortName&SortOrder=Ascending&format=json");	
			GuiPage_Playlist.start(ItemData.Items[selectedItem].Name,url,ItemData.Items[selectedItem].MediaType,ItemData.Items[selectedItem].Id);
			break;		
		default:
			switch (ItemData.Items[selectedItem].MediaType) {
			case "Photo":
				GuiImagePlayer.start(ItemData,selectedItem);
				break;	
			case "Video":	
				var url = Server.getItemInfoURL(ItemData.Items[selectedItem].Id,null);
				GuiPage_ItemDetails.start(ItemData.Items[selectedItem].Name,url,0);
				break;
			case "Audio":
				Support.removeLatestURL(); //Music player loads within the previous page - thus remove!
				var url = Server.getItemInfoURL(ItemData.Items[selectedItem].Id,null);
				GuiMusicPlayer.start("Song",url,page,false);
				break;
			default:
				Support.removeLatestURL();
				break;
			}
			break;
		}
	}
}

//-----------------------------------------------------------------------------------------------------------------------------------------

Support.playSelectedItem = function(page,ItemData,startParams,selectedItem,topLeftItem,isTop) {
	startParams[2] = (startParams[2] === undefined) ? null : startParams[2];
	startParams[3] = (startParams[3] === undefined) ? null : startParams[3];
	
	alert ("playSelectedItem: CollectionType "+ItemData.Items[selectedItem].CollectionType);
	alert ("playSelectedItem: MediaType "+ItemData.Items[selectedItem].MediaType);
	alert ("playSelectedItem: Type "+ItemData.Items[selectedItem].Type);
	if (ItemData.Items[selectedItem].Type == "Folder") {
		if (page == "GuiPage_Photos") {
			Support.updateURLHistory(page,startParams[0],startParams[1],startParams[2],startParams[3],selectedItem,topLeftItem,isTop);
			GuiImagePlayer.start(ItemData,selectedItem,true);	
		}
	} else if (ItemData.Items[selectedItem].MediaType == "Video") {
		if (ItemData.Items[selectedItem].LocationType == "Virtual"){
			return;
		}
		Support.updateURLHistory(page,startParams[0],startParams[1],startParams[2],startParams[3],selectedItem,topLeftItem,isTop);
		var url = Server.getItemInfoURL(ItemData.Items[selectedItem].Id,"&ExcludeLocationTypes=Virtual");
		GuiPlayer.start("PLAY",url,ItemData.Items[selectedItem].UserData.PlaybackPositionTicks / 10000,page);	
	} else if (ItemData.Items[selectedItem].MediaType == "ChannelVideoItem") {
		Support.updateURLHistory(page,startParams[0],startParams[1],startParams[2],startParams[3],selectedItem,topLeftItem,isTop);
		var url = Server.getItemInfoURL(ItemData.Items[selectedItem].Id,"&ExcludeLocationTypes=Virtual");
		GuiPlayer.start("PLAY",url,ItemData.Items[selectedItem].UserData.PlaybackPositionTicks / 10000,page);	
	} else if (ItemData.Items[selectedItem].CollectionType == "photos") {
		Support.updateURLHistory(page,startParams[0],startParams[1],startParams[2],startParams[3],selectedItem,topLeftItem,isTop);
		GuiImagePlayer.start(ItemData,selectedItem,true);	
	} else if (ItemData.Items[selectedItem].Type == "PhotoAlbum") {
		Support.updateURLHistory(page,startParams[0],startParams[1],startParams[2],startParams[3],selectedItem,topLeftItem,isTop);
		GuiImagePlayer.start(ItemData,selectedItem,true);	
	} else if (ItemData.Items[selectedItem].Type == "Series") {
		Support.updateURLHistory(page,startParams[0],startParams[1],null,null,selectedItem,topLeftItem,null);
		var url= Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&ExcludeLocationTypes=Virtual&IncludeItemTypes=Episode&Recursive=true&SortBy=SortName&SortOrder=Ascending&Fields=ParentId,SortName,MediaSources")
		GuiPlayer.start("PlayAll",url,0,page);
	} else if (ItemData.Items[selectedItem].Type == "Season") {
		Support.updateURLHistory(page,startParams[0],startParams[1],null,null,selectedItem,topLeftItem,null);
		var urlToPlay= Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&ExcludeLocationTypes=Virtual&IncludeItemTypes=Episode&Recursive=true&SortBy=SortName&SortOrder=Ascending&Fields=ParentId,SortName,MediaSources")
		GuiPlayer.start("PlayAll",urlToPlay,0,page);	
	} else if (ItemData.Items[selectedItem].Type == "Movie" || ItemData.Items[selectedItem].Type == "Episode") {
		Support.updateURLHistory(page,startParams[0],startParams[1],null,null,selectedItem,topLeftItem,null);
		var url = Server.getItemInfoURL(ItemData.Items[selectedItem].Id,"&ExcludeLocationTypes=Virtual");
		GuiPlayer.start("PLAY",url,0,page);
	}
}

//-----------------------------------------------------------------------------------------------------------------------------------------


Support.scrollingText = function(divToScroll) {
	
	clearTimeout(Support.startScroll);
	clearTimeout(Support.resetToTop);
	clearInterval(Support.scroller);
	
	var div = $('#'+divToScroll+'');
	div.scrollTop(0);
	Support.scrollpos = 0;

	Support.startScroll = setTimeout(function(){		
		Support.scroller = setInterval(function(){
			var pos = div.scrollTop() + 1;
		    div.scrollTop(pos);
		    
		    if (Support.scrollpos == pos) {
		    	clearInterval(Support.scroller);
		    	Support.resetToTop = setTimeout(function(){	
		    		Support.scrollingText(divToScroll);
				}, 10000); //Length of pause at the bottom
		    } else {
		    	Support.scrollpos = pos;
		    }	    
		}, 325); //Scrolling speed
	}, 10000);	//Intial delay
}

Support.generateMainMenu = function() {
	
	var menuItems = [];
	
	menuItems.push("Home");
	
	//Check Favourites
	var urlFav = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&Filters=IsFavorite&fields=SortName&recursive=true");
	var hasFavourites = Server.getContent(urlFav);
	if (hasFavourites == null) { return; }
	
	if (hasFavourites.TotalRecordCount > 0) {
		menuItems.push("Favourites");
	}
	
	var userViews = Server.getUserViews();
	for (var i = 0; i < userViews.Items.length; i++){
		if (userViews.Items[i].CollectionType == "tvshows" || 
				userViews.Items[i].CollectionType == "homevideos" || 
				userViews.Items[i].CollectionType == "boxsets" || 
				userViews.Items[i].CollectionType == "movies" || 
				userViews.Items[i].CollectionType == "photos" || 
				userViews.Items[i].CollectionType == "music"){
			var name = "";
			if (userViews.Items[i].CollectionType == "tvshows") {
				name = "TV";
			} else if (userViews.Items[i].CollectionType == "homevideos") {
				name = "Home-Movies";
			} else if (userViews.Items[i].CollectionType == "boxsets") {
				name = "Collections";
			} else if (userViews.Items[i].CollectionType == "movies") {
				name = "Movies";
			} else if (userViews.Items[i].CollectionType == "photos") {
				name = "Photos";
			} else if (userViews.Items[i].CollectionType == "music") {
				name = "Music";
			}
			if ($.inArray(name, menuItems) < 0) {
				menuItems.push(name);
			}
		}
	}
	
	//Check Server Playlists
	var urlPlaylists = Server.getItemTypeURL("/SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Playlist&Recursive=true&Limit=0");
	var hasPlaylists = Server.getContent(urlPlaylists);
	if (hasPlaylists == null) { return; }
	
	if (hasPlaylists.TotalRecordCount > 0) {
		menuItems.push("Playlists");
	}

	/*
	//Check Live TV
	var urlLiveTV = Server.getCustomURL("/LiveTV/Info?format=json");
	var hasLiveTV = Server.getContent(urlLiveTV);
	if (hasLiveTV == null) { return; }
	if (Main.isLiveTVEnabled() && hasLiveTV.IsEnabled) {
		for (var index = 0; index < hasLiveTV.EnabledUsers.length; index++) {
			if (Server.getUserID() == hasLiveTV.EnabledUsers[index]) {
				menuItems.push("Live-TV");
				break;
			}
		}
	}
	
	//Check Channels
	if (Main.isChannelsEnabled()) {
		var urlChannels = Server.getCustomURL("/Channels?userId="+Server.getUserID()+"&format=json");
		var hasChannels = Server.getContent(urlChannels);
		if (hasChannels == null) { return; }
		
		if (hasChannels.Items.length > 0) {
			menuItems.push("Channels");
		}
	}*/
	
	//Check Media Folders
	var urlMF = Server.getItemTypeURL("&Limit=0");
	var hasMediaFolders = Server.getContent(urlMF);
	if (hasMediaFolders == null) { return; }
		
	if (hasMediaFolders.TotalRecordCount > 0) {
		menuItems.push("Media-Folders");
	}

	return menuItems;
}

Support.generateTopMenu = function() {
	
	var menuItems = [];
	
	var userViews = Server.getUserViews();
	for (var i = 0; i < userViews.Items.length; i++){
		if (userViews.Items[i].CollectionType == "tvshows" || 
				userViews.Items[i].CollectionType == "boxsets" || 
				userViews.Items[i].CollectionType == "movies" || 
				userViews.Items[i].CollectionType == "photos" || 
				userViews.Items[i].CollectionType == "music"){
			var name = "";
			if (userViews.Items[i].CollectionType == "tvshows") {
				name = "TV";
			} else if (userViews.Items[i].CollectionType == "boxsets") {
				name = "Collections";
			} else if (userViews.Items[i].CollectionType == "movies") {
				name = "Movies";
			} else if (userViews.Items[i].CollectionType == "photos") {
				name = "Photos";
			} else if (userViews.Items[i].CollectionType == "music") {
				name = "Music";
			}
			if ($.inArray(name, menuItems) < 0) {
				menuItems.push(name);
			}
		}
	}
	
	//Check Media Folders
	var urlMF = Server.getItemTypeURL("&Limit=0");
	var hasMediaFolders = Server.getContent(urlMF);
	if (hasMediaFolders == null) { return; }
		
	if (hasMediaFolders.TotalRecordCount > 0) {
		menuItems.push("Media-Folders");
	}

	return menuItems;
}

//-----------------------------------------------------------------------------------------------------------------------------------------
Support.processHomePageMenu = function (menuItem) {
	switch (menuItem) {
	case "Home":
		Support.removeAllURLs();
		
		var url = Server.getServerAddr() + "/Users/"+Server.getUserID()+"/Items?format=json&SortBy=DatePlayed&SortOrder=Descending&MediaTypes=Video&Filters=IsResumable&Limit=10&Recursive=true&Fields=PrimaryImageAspectRatio,SyncInfo&CollapseBoxSetItems=false&ExcludeLocationTypes=Virtual&ImageTypeLimit=1&EnableImageTypes=Primary,Backdrop,Banner,Thumb";
		resumeItems = Server.getContent(url);
		if (resumeItems.TotalRecordCount > 0 && File.getUserProperty("ContinueWatching") == true){
			var url1 = url;
			var title1 = "Continue Watching";
			var url2 = File.getUserProperty("View1");
			var title2 = File.getUserProperty("View1Name");
		} else {
			var url1 = File.getUserProperty("View1");
			var title1 = File.getUserProperty("View1Name");
			var url2 = File.getUserProperty("View2");
			var title2 = File.getUserProperty("View2Name");
		}
		
		if (url2 != null) {
			GuiPage_HomeTwoItems.start(title1,url1,title2,url2,0,0,true);
		} else {
			GuiPage_HomeOneItem.start(title1,url1,0,0);
		}
		
		break;
	case "Favourites":
		var url = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&Filters=IsFavorite&fields=SortName&recursive=true");
		GuiDisplayOneItem.start("Favourites", url,0,0);
		break;	
	case "Media-Folders":
		var url = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&CollapseBoxSetItems=false&fields=SortName");	
		GuiDisplayOneItem.start("Media Folders", url,0,0);
		break;
	case "Channels":
		var url = Server.getCustomURL("/Channels?userId="+Server.getUserID()+"&format=json");	
		GuiDisplayOneItem.start("Channels", url,0,0);
		break;
	case "Collections":	
		var url = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=BoxSet&Recursive=true&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
		GuiDisplay_Series.start("All Collections", url,0,0);
		break;		
	case "TV":
		var url = Server.getItemTypeURL("&IncludeItemTypes=Series&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true");
		GuiDisplay_Series.start("All TV",url,0,0);
		break;	
	case "Movies":
		var url = Server.getItemTypeURL("&IncludeItemTypes=Movie&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true");
		GuiDisplay_Series.start("All Movies",url,0,0);
		break;
	case "Music":
		GuiPage_MusicAZ.start("Album");
		break;
	case "Playlists":
		var url = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&fields=SortName&IncludeItemTypes=Playlist&Recursive=true");
		GuiDisplayOneItem.start("Playlists", url,0,0);
		break;		
	case "Photos":
		var photosFolderId = Server.getUserViewId("photos");
		if (photosFolderId != null){
			var url = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&Fields=SortName&StartIndex=0&Limit=500&Recursive=false&IncludeItemTypes=&MediaTypes=&ParentId="+photosFolderId);
			GuiPage_Photos.start("Photos",url,0,0);
		}
		break;
	case "Home-Movies":
		var homeVideosFolderId = Server.getUserViewId("homevideos");
		if (homeVideosFolderId != null){
			var url = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&fields=PrimaryImageAspectRatio,SortName&ParentId="+homeVideosFolderId);
			GuiDisplayOneItem.start("Home Movies",url,0,0);
		}
		break;
	case "Search":
		GuiPage_Search.start();
		break;		
	case "Settings":
		GuiPage_Settings.start();
		break;	
	case "Contributors":
		GuiPage_Contributors.start();
		break;		
	case "Log-Out":
		if (File.getUserProperty("ForgetSavedPassword")) {
			File.setUserProperty("Password","");
			File.setUserProperty("ForgetSavedPassword",false);
		}
		Support.logout();
		break;		
	case "Log-Out_Delete":
		alert("Log-Out_Delete");
		File.setUserProperty("Password","");
		Support.logout();
		break;		
	}
}

Support.parseSearchTerm = function(searchTermString) {
	var parsedString = searchTermString.replace(/ /gi, "%20");
	//Probably more chars to parse here!
	return parsedString;
}

Support.fadeImage = function(imgsrc) {
	var bg = $('#pageBackground').css('background-image');
	if (bg != "none") { // catch initial entry from user page to app!
		bg = bg.replace('url(','').slice(0, -1);
		if (bg.substring(0,5) == "'file") {
			bg = bg.substring(bg.indexOf("images")).slice(0, -1);
		}
		//Do nothing!
		if (bg != imgsrc) {
			var imgHolder = new Image();  
		    imgHolder.onload = function(){
		    	$('#pageBackgroundHolder').css("background-image","url('"+bg+"')");
		    	var img = new Image();  
			    img.onload = function(){
			      // image  has been loaded
			    	$('#pageBackground').css("display","none");
			    	$('#pageBackground').css("background-image","url('"+imgsrc+"')");
			        $('#pageBackground').fadeIn(500);	
			        img = null;
			    };
			    img.src = imgsrc
		    	
			    imgHolder = null;
		    };
		    imgHolder.src = bg
		}	
	} else {
		var img = new Image();  
	    img.onload = function(){
	      // image  has been loaded
	    	$('#pageBackground').css("display","none");
	    	$('#pageBackground').css("background-image","url('"+imgsrc+"')");
	        $('#pageBackground').fadeIn(500);	
	        img = null;
	    };
	    img.src = imgsrc
	}
}

Support.randomBackground = function() {
	//var backdropTimeout = setTimeout(function(){
		var randomImageURL = Server.getItemTypeURL("&SortBy=Random&IncludeItemTypes=Series,Movie&Recursive=true&CollapseBoxSetItems=false&Limit=20");
		var randomImageData = Server.getContent(randomImageURL);
		if (randomImageData == null) { return; }
		
		for (var index = 0; index < randomImageData.Items.length; index++) {
			if (randomImageData.Items[index ].BackdropImageTags.length > 0) {
				var imgsrc = Server.getBackgroundImageURL(randomImageData.Items[index ].Id,"Backdrop",960,540,0,false,0,randomImageData.Items[index ].BackdropImageTags.length);
				Support.fadeImage(imgsrc);
				break;
			}
		}
	//}, 1000);
}

//-----------------------------------------------------------------------------------------------------------------------------------------
Support.screensaver = function () {
	if (Main.isScreensaverEnabled()) {
		clearTimeout(this.screensaverVar);
		this.screensaverVar  = setTimeout(function(){
			if (Support.isScreensaverOn == true) {
				GuiImagePlayer_Screensaver.start();
			}	
		}, File.getUserProperty("ScreensaverTimeout"));
	}
}

Support.screensaverOn = function () {
	this.isScreensaverOn = true;
}

Support.screensaverOff = function () {
	if (Main.isScreensaverEnabled()) {
		clearTimeout(this.screensaverVar);
		this.isScreensaverOn = false;
		
		if (Main.getIsScreensaverRunning()) {
			Main.setIsScreensaverRunning(); //Sets to False
			GuiImagePlayer_Screensaver.stopScreensaver(); //Kill Screensaver
		}
	}
}

//-----------------------------------------------------------------------------------------------------------------------------------------
Support.pageLoadTimes = function(page,process,reset) {
	if (reset == true) {
		Support.pageLoadedTime = new Date().getTime();	
	} else {
		var time = new Date().getTime() - Support.pageLoadedTime;
		switch (process) {	
			case "Start": 
			FileLog.write("Loading : " + page + " : New Page Loaded : Time 0");
			break;	
			case "RetrievedServerData":
				FileLog.write("Loading : " + page + " : Retrieved Data From Server : Time " + time + "ms");
			break;
			case "UserControl":
				FileLog.write("Loading : " + page + " : User Control : Time " + time + "ms");
			break;
			case "GetRemainingItems":
				FileLog.write("Loading : " + page + " : Getting Additional Data > 200 Items : Time " + time + "ms");
			break;
			case "GotRemainingItems":
				FileLog.write("Loading : " + page + " : Got Additional Data > 200 Items : Time " + time + "ms");
			break;
			case "AddedRemainingItems":
				FileLog.write("Loading : " + page + " : Added Additional Data > 200 Items to original 200 Items : Time " + time + "ms");
			break;
			default:
			break;
		}
	}
}


//-----------------------------------------------------------------------------------------------------------------------------------------

Support.noitemskeyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	//Update Screensaver Timer
	Support.screensaver();
	
	//If screensaver is running 
	if (Main.getIsScreensaverRunning()) {
		//Update Main.js isScreensaverRunning - Sets to True
		Main.setIsScreensaverRunning();
		
		//End Screensaver
		GuiImagePlayer_Screensaver.stopScreensaver();
		
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode){
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;		
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent();
			break;
	}
}

//-----------------------------------------------------------------------------------------------------------------------------------------
Support.convertTicksToTime = function (currentTime, duration) {
	 totalTimeHour = Math.floor(duration / 3600000);
    timeHour = Math.floor(currentTime / 3600000);
    totalTimeMinute = Math.floor((duration % 3600000) / 60000);
    timeMinute = Math.floor((currentTime % 3600000) / 60000);
    totalTimeSecond = Math.floor((duration % 60000) / 1000);
    timeSecond = Math.floor((currentTime % 60000) / 1000);
    timeHTML = timeHour + ":";

    if (timeMinute == 0) {
        timeHTML += "00:";
    } else if (timeMinute < 10) {
         timeHTML += "0" + timeMinute + ":";
    } else {
         timeHTML += timeMinute + ":";
    }

    if (timeSecond == 0) {
        timeHTML += "00/";
    } else if (timeSecond < 10) {
         timeHTML += "0" + timeSecond + "/";
    } else {
         timeHTML += timeSecond + "/";
    }
    timeHTML += totalTimeHour + ":";

    if (totalTimeMinute == 0) {
         timeHTML += "00:";
    } else if (totalTimeMinute < 10)
        timeHTML += "0" + totalTimeMinute + ":";
    else {
         timeHTML += totalTimeMinute + ":";

    }

    if (totalTimeSecond == 0) {
         timeHTML += "00";
    } else if (totalTimeSecond < 10) {
        timeHTML += "0" + totalTimeSecond;
    } else
        timeHTML += totalTimeSecond;
    
    return timeHTML;
}


Support.convertTicksToTimeSingle = function (currentTime) {
   timeHour = Math.floor(currentTime / 3600000);
   timeMinute = Math.floor((currentTime % 3600000) / 60000);
   timeSecond = Math.floor((currentTime % 60000) / 1000);
   timeHTML = timeHour + ":";

   if (timeMinute == 0) {
       timeHTML += "00:";
   } else if (timeMinute < 10) {
        timeHTML += "0" + timeMinute + ":";
   } else {
        timeHTML += timeMinute + ":";
   }

   if (timeSecond == 0) {
       timeHTML += "00";
   } else if (timeSecond < 10) {
        timeHTML += "0" + timeSecond;
   } else {
        timeHTML += timeSecond;
   }
   
   //ShowMin will show only the time without any leading 00
   if (timeHour == 0) {
	   timeHTML = timeHTML.substring(2,timeHTML.length);
   }
   
   return timeHTML;
}

Support.convertTicksToMinutes = function (currentTime) {
	timeMinute = Math.floor((currentTime / 3600000) * 60);
	return timeMinute + " mins";
}

//-------------------------------------------------------------------------------------------------------------

Support.SeriesRun = function(type, prodyear, status, enddate) {
	var output = "";
	if (type != "Series") {
		return prodyear;
	} else if (prodyear) {
		output += prodyear;
		if (status == "Continuing") {
			output += "-Present";
		} else if (enddate) {		
			var year = enddate.substring(0,4);
			var month = enddate.substring(5,7);
			var day = enddate.substring(8,10);
			var endyear = new Date(year,month-1,day);
			var yyyy = endyear.getFullYear();
			if (yyyy != prodyear) {
				output += "-" + yyyy;
			}
		}
		return output;
	}
}

//Cannot parse the date from the API into a Date Object
//Substring out relevant areas
Support.AirDate = function(apiDate, type) {
	var year = apiDate.substring(0,4);
	var month = apiDate.substring(5,7);
	var day = apiDate.substring(8,10);

	if (type != "Episode") {
		return year;
	} else {
		return day + '/' + month + '/' + year;
	}
}

Support.FutureDate = function(apiDate) {
	var year = apiDate.substring(0,4);
	var month = apiDate.substring(5,7);
	var day = apiDate.substring(8,10);
	
	var airdate = new Date(year,month-1,day); //Month is stored in array starting at index 0!
	var now = new Date()

	if (now < airdate){
		return true;
	} else {
		return false;
	}
}

//
//Replaced with AirDate Function
Support.formatDateTime = function(apiDate, formatOption) {
	//Below based on date serialisation 2006-04-07T23:00:00.0000000Z
	//formatOption 0 = Date Only (Default) 1 = Date & Time
	var year = apiDate.substring(0,4);
	var month = apiDate.substring(5,7);
	var day = apiDate.substring(8,10);
	var time = apiDate.substring(11,16);

	switch (formatOption) {
	default:
	case 0:
		return day + "/" + month + "/" + year;
	break;
	case 1:
		return day + "/" + month + "/" + year + " : " + time;
		break;
	}
	
	//Should never get here!!!!!
	return day + "/" + month + "/" + year;
}

Support.setImagePlayerOverlay = function(string, format) {
	switch (format) {
	case 0:
		document.getElementById("GuiImagePlayer_ScreensaverOverlay").innerHTML = string.substring(0,10)
		break;
	case 1:
		document.getElementById("GuiImagePlayer_ScreensaverOverlay").innerHTML = string
		break;
	case 2:
		document.getElementById("GuiImagePlayer_ScreensaverOverlay").innerHTML = ""
		break;
	}
	
}

Support.styleSubtitles = function (element) {
	document.getElementById(element).style.color = File.getUserProperty("SubtitleColour");
	document.getElementById(element).style.fontSize = File.getUserProperty("SubtitleSize");
	document.getElementById(element).style.textShadow = "0px 0px 5px rgba(0, 0, 0, 1)";
}

Support.getStarRatingImage = function(rating) {
	switch (Math.round(rating)) {
	case 0:
	default:
		return "<img src='images/Star_Empty.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'>"
		break;
	case 1:
		return "<img src='images/Star_Half.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'>"
		break;
	case 2:
		return "<img src='images/Star_Full.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'>"
		break;
	case 3:
		return "<img src='images/Star_Full.png'><img src='images/Star_Half.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'>"
		break;
	case 4:
		return "<img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'>"
		break;
	case 5:
		return "<img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Half.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'>"
		break;
	case 6:
		return "<img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Empty.png'><img src='images/Star_Empty.png'>"
		break;
	case 7:
		return "<img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Half.png'><img src='images/Star_Empty.png'>"
		break;
	case 8:
		return "<img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Empty.png'>"
		break;
	case 9:
		return "<img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Half.png'>"
		break;	
	case 10:
		return "<img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Full.png'><img src='images/Star_Full.png'>"
		break;
	} 
}

Support.isPower = function(a,b) {
		if ( a == 0) {
			return true;
		}
		//This is a brain dead way of doing this. I expect you can do better! 
		for (var i = 0; i < 1000; i++){
			if (a/i == b){
				return true;
				break;
			}
		}
		return false;	
};