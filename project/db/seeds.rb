# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

bob = User.where(login: "bob").first_or_create!(
	name: "bob",
);

bob.avatar.attach(
	io: URI.open("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1pEVYSLDyjch3zZYccCMgguA2zDSLyVP8EPrOb_2DSPNuV60si_Qju-Ll9fnDvfzEXcDEGDTD&usqp=CAc"),
	filename: "bob.png",
	"content_type": "image/png",
)


bill = User.create(name: "bill", login: "bill", contribution: 10);
ben = User.create(name: "ben", login: "ben", contribution: 15);
bon = User.create(name: "bon", login: "bon", contribution: 15);
babar = User.create(name: "babar", login: "babar", contribution: 15);
bin = User.create(name: "bin", login: "bin", contribution: 15);
bun = User.create(name: "bun", login: "bun", contribution: 15);
bkkn = User.create(name: "bkkn", login: "bkkn", contribution: 15);
boon = User.create(name: "boon", login: "boon", contribution: 15);
beejn = User.create(name: "beejn", login: "beejn", contribution: 15);
bppn = User.create(name: "bppn", login: "bppn", contribution: 15);

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


guild1 = Guild.create(name: 'The Best Guild', ang: "TBG", points: 0, atWar: true)
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
guild1.members << bon
guild1.members << babar
guild1.members << bin
guild1.members << bun
guild1.members << bkkn
guild1.members << boon
guild1.members << beejn
guild1.members << bppn