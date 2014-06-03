var webappfullcontainer = document.querySelector( '#webappfullcontent' ), 
	msnry = new Masonry( 
		webappfullcontainer, 
		{ 
			columnWidth: 10, 
			itemSelector: '.item', 
			isAnimated: true, 
			animationOptions: { 
				duration: 1000, 
				easing: 'linear', 
				queue: false 
			} 
		} 
	); 