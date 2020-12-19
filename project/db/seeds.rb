# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

bob = User.create(name: "bob", login: "bob");

bob.avatar.attach(
	io: URI.open("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1pEVYSLDyjch3zZYccCMgguA2zDSLyVP8EPrOb_2DSPNuV60si_Qju-Ll9fnDvfzEXcDEGDTD&usqp=CAc"),
	filename: "bob.png",
	"content_type": "image/png",
)


bill = User.create(name: "bill", login: "bill", contribution: 10);
ben = User.create(name: "ben", login: "ben", contribution: 15);
boule = User.create(name: "boule", login: "boule", contribution: 0);
babar = User.create(name: "babar", login: "babar", contribution: 5);
billy = User.create(name: "billy", login: "billy", contribution: 1);
jeff = User.create(name: "jeff", login: "jeff", contribution: 1);
john = User.create(name: "john", login: "john", contribution: 1);
jack = User.create(name: "jack", login: "jack", contribution: 1);

game1 = Game.create(level: "easy", points: 3, status: "waiting");

bill.avatar.attach(
	io: URI.open("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Hotdog_-_Evan_Swigart.jpg/1024px-Hotdog_-_Evan_Swigart.jpg"),
	filename: "bill.png",
	"content_type": "image/png",
)

ben.avatar.attach(
	io: URI.open("https://images.theconversation.com/files/273610/original/file-20190509-183106-1fqctm9.jpg?ixlib=rb-1.1.0&rect=9%2C53%2C3254%2C2384&q=45&auto=format&w=926&fit=clip"),
	filename: "ben.png",
	"content_type": "image/png",
)


guild1 = Guild.create(name: 'The Best Guild', ang: "TBG", points: 18, atWar: true)
guild2 = Guild.create(name: 'The Doom', ang: "TDM", points: 2)


guild1.img.attach(
	io: URI.open("https://i.pinimg.com/originals/1a/27/ff/1a27ff81c19e1c10583ea970b0f3827f.jpg"),
	filename: "guild1.jpg",
	"content_type": "image/jpg",
)

guild2.img.attach(
	io: URI.open("https://www.picclickimg.com/d/l400/pict/263841790404_/Harry-Potter-Hogwarts-RAVENCLAW-QUIDDITCH-TEAM-CAPTAIN-Pin.jpg"),
	filename: "guild2.jpg",
	"content_type": "image/jpg",
)

guild1.members << bill
bill.add_role(:owner, guild1)
guild1.members << ben
guild2.members << boule
boule.add_role(:owner, guild2)
guild2.members << babar
guild1.members << billy
guild1.members << jeff
guild1.members << jack
guild1.members << john
