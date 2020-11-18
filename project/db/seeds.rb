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
	io: URI.open("https://cdn.shopify.com/s/files/1/0240/3441/0601/products/135.png?v=1598373418"),
	filename: "bob.png",
	"content_type": "image/png",
)

guild1 = Guild.create(name: 'The Best Guild', ang: "TBG", points: 0)
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