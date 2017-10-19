$(document).ready(function(){

	// array of cryptocurrencies fetched from CMC
	var Cryptos = [];
	// my sweet dictionary
	var CryptoDict = [];
	// reference currency price and trend
	var rc_price = 1;
	var rc_trend = 0;

	refreshCryptos();

	function refreshCryptos() {

		// clear old JSON data
		Cryptos = [];

		// use CMC API (limit to top-100  for now)
		var jsonURL = 'https://api.coinmarketcap.com/v1/ticker/?limit=100';

		// Get jSON Object from server
		$.getJSON( jsonURL, function( data ) {

			// get objects array
			$.each( data, function( index, elem ) {
				Cryptos.push(elem);
				CryptoDict[elem.symbol] = index;
			});

			// update dropdown menu
			updateDropdown();
			// print objects
			showCryptos();

		});


	}

	function updateDropdown() {

		// clear old menu
		$("#sel_CUR").empty;

		for(var i=0; i<Cryptos.length; i++) {
			var coin = Cryptos[i].symbol;
			var currentOption = "<option value='" + coin + "'>" + coin + "</option>"
			$("#sel_CUR").append(currentOption);

		}

	}


	function showCryptos() {

		// clear everything
		$("#mainList").empty();

		for(var i=0; i<Cryptos.length; i++) {

			var myPrice = Cryptos[i].price_usd / rc_price;
			var myTrend = (Cryptos[i].percent_change_24h - rc_trend) / (rc_trend/100 + 1);

			var currentRow = "<tr><td>" + (i+1) + "</td><td><div class='row'><div class='col'>"
						   + "<i class='cc " + Cryptos[i].symbol + "' title='" + Cryptos[i].symbol + "'></i></div><div class='col'>"
						   + Cryptos[i].symbol + "</div><div class='col-7'>"
						   + Cryptos[i].name + "</div></div></td><td>"
						   + (Cryptos[i].market_cap_usd/1000000).toFixed(3).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " M$</td><td>"
						   + myPrice.toFixed(12) + "</td><td>" + myTrend.toFixed(2) + "%</td></tr>";

			$("#mainList").append(currentRow);

		}

	}

	// Reference Currency
	var rcmenu = document.getElementById("sel_CUR");
	rcmenu.onchange = function() {

		var rc = rcmenu.options[rcmenu.selectedIndex].value;

		if(rc == "USD") {
			rc_price = 1;
			rc_trend = 0;
		} else {
			rc_price = Cryptos[CryptoDict[rc]].price_usd;
			rc_trend = Cryptos[CryptoDict[rc]].percent_change_24h;
		}

		showCryptos();

	}

}); // END function on $(document).ready
