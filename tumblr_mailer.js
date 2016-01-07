var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvFile = fs.readFileSync("friend_list.csv","utf8");//csv file
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');//email temp

var client = tumblr.createClient({ //Tumblr Auth
  consumer_key: 'mYVmdV7jdniwFocFsX3BOCSvzAIuZI2JDRL7s2P5kjzO76tEJr',
  consumer_secret: 'FNKldqRu9VErFfkKLVw0lwmRIERSWD0Ifw58p0Vx9fkm1mS1dD',
  token: 'goApyhAQGeIkqXlOTH3xBLigb9Y49HIkUmMhZedA5iCeKfNoRQ',
  token_secret: 'tSHhP9CwuXJf3p488Fg7J8S88RAGF9PXDKGvVUlZ86m30DQWY2'
});



function csvParse(file){ // parses csv file into array of objects
	var newFile = file.split(/\r\n|\n/); 
	var headers = newFile[0].split(',');
	var finalArr =[];

	for(i=1; i<newFile.length;i++){
		var data = newFile[i].split(',');
		var obj ={};
		for(j=0;j<headers.length;j++){
			obj[headers[j]] = data[j];
		}
		finalArr.push(obj);
	}
	return finalArr;
}

var friendList = csvParse(csvFile); //array of objects w/ info about contacts


var latestPosts=[];
client.posts('sp6pe.tumblr.com', function(err, blog){

  var todayTime = Math.floor(Date.now() / 1000);

  var obj ={};

  for(i=0;i<blog.posts.length;i++){

  	if(todayTime-blog.posts[i].timestamp < 11604800){
  		obj.title = blog.posts[i].title;
  		obj.url = blog.posts[i].post_url;
  	}
  	latestPosts.push(obj);

  }
	
	friendList.forEach(function(row){
		var firstName = row["firstName"];
		var numMonthsSinceContact = row["numMonthsSinceContact"];

		var customizedTemplate = ejs.render(emailTemplate, 
                { firstName: firstName,  
                  numMonthsSinceContact: numMonthsSinceContact,
                  latestPosts:latestPosts
                });

		console.log(customizedTemplate);
		});

});

//console.log(emailEJS(emailTemplate));




/*function emailGen(emailTemp){
	friendList.forEach(function(row){
		var firstName = row["firstName"];
		var numMonthsSinceContact = row["numMonthsSinceContact"];
		var tempCopy = emailTemplate;

		tempCopy = tempCopy.replace(/FIRST_NAME/gi,firstName).replace(/NUM_MONTHS_SINCE_CONTACT/gi,numMonthsSinceContact);
		//console.log(tempCopy);
	});

}*/










