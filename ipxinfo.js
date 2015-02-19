function sendipx ( url, retCmd ) {
	var http = require ( 'http' );
	var str = '';
	http.get ( url, function( res ) {
		res.on ( 'data', function ( chunk ) {
			str += chunk;
		});
		res.on ( 'end', function () {
			retCmd ( str );
		});
	}).on ( 'error', function ( error ) {
		console.log ( '\nipxinfo [erreur] => ' + error.message );
	});
}

exports.action = function ( data , callback , config , SARAH ) {
	var	cfg 	= config.modules.ipxinfo;
	var ipxUrl = 'http://' + cfg.User + ':' + cfg.Password + '@' + cfg.Host + '/globalstatus.xml';


	sendipx( ipxUrl, function ( retCmd ) {
		var str = new RegExp ( '<' + data.tag + '>(.*?)<\/' + data.tag + '>', 'gm' ).exec( retCmd )[1];

		switch ( str ) {
			case '1' :
				exports.info = 'active';
				exports.store = 'ouvert';
				//exports.ecl = 'allumée';
				data.ttsAction = data.ttsAction.replace ( /x/, exports.info);
				data.ttsAction = data.ttsAction.replace ( /%/, exports.store);
				//data.ttsAction = data.ttsAction.replace ( /z/, exports.ecl);
				break;
			case '0' :
				exports.info = 'désactiver';
				exports.store = 'fermée';
				//exports.ect = 'éteint';
				data.ttsAction = data.ttsAction.replace ( /x/, exports.info);
				data.ttsAction = data.ttsAction.replace ( /%/, exports.store);
				//data.ttsAction = data.ttsAction.replace ( /z/, exports.ecl);
				break;
		}
		console.log ( '\nipxinfo [OK] => ' + data.ttsAction );
		callback ({ 'tts' : data.ttsAction });
	});
}
