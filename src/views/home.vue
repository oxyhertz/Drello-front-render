<template >
	<section class="home-container">
		<section class="hero">
			<header>
				<div class="logo">
					<img src="../images/trello-logo.png" width="25px" height="25px" alt />
					<h1>Drello</h1>
				</div>
				<div class="auth-btns">
					<div class="btn login">
						<router-link to="/login">Log in</router-link>
					</div>
					<div class="btn signup">
						<router-link to="/signup">Sign up</router-link>
					</div>
				</div>
			</header>
			<section class="info-container info-1 home-layout">
				<section>
					<h1>Drello helps teams move work forward.</h1>
					<p>
						Collaborate, manage projects, and reach new productivity peaks. From
						high rises to the home office, the way your team works is
						unique accomplish it all with Drello.
					</p>
					<button class="btn-primary" @click="moveToBoards">Try live demo</button>
				</section>

				<img class="hero-img" src="../images/homepage/hero.png" alt />
			</section>
		</section>
		<main class="home-layout">
			<section class="info-container info-2">
				<h2>It's more than work. It's a way of working together.</h2>
				<p>
					Start with a Drello board, lists, and cards. Customize and expand with
					more features as your teamwork grows. Manage projects, organize tasks,
					and build team spirit all in one place.
				</p>
			</section>
			<section class="info-container info-3">
				<img src="../images/homepage/board.png" class="board-img" alt="board" />
				<p>Join over 1,000,000 teams worldwide that are using Drello to get more done.</p>
				<img src="../images/trello-partners.png" class="trello-partners" />
			</section>

			<section class="info-container info-4">
				<h2>Features to help your team succeed</h2>
				<p>
					Powering a productive team means using a powerful tool (and plenty of
					snacks). From meetings and projects to events and goal setting, Drello’s
					intuitive features give any team the ability to quickly set up and
					customize workflows for just about anything.
				</p>
			</section>

			<section class="info-container info-5">
				<img src="../images/homepage/view.svg" alt="view" />
				<section>
					<h5>CHOOSE A VIEW</h5>
					<h2>The board is just the beginning</h2>
					<p>
						Lists and cards are the building blocks of organizing work on a Drello
						board. Grow from there with task assignments, timelines, productivity
						metrics, calendars, and more.
					</p>
				</section>
			</section>
			<section class="info-container info-6">
				<section>
					<h5>DIVE INTO THE DETAILS</h5>
					<h2>Cards contain everything you need</h2>
					<p>
						Drello cards are your portal to more organized work—where every single
						part of your task can be managed, tracked, and shared with teammates.
						Open any card to uncover an ecosystem of checklists, due dates,
						attachments, conversations, and more.
					</p>
				</section>
				<img src="../images/homepage/card-back.svg" alt="card-back" />
			</section>
		</main>
	</section>
</template>

<script>
import { userService } from '../services/user-service';

export default {
	name: 'home-page',
	methods: {
		async moveToBoards() {
			await this.$store.dispatch({ type: 'login', cred: userService.getGuestUser() });
			this.$router.push('/board')
		},
		setHomePage(isHome) {
			this.$store.commit({ type: 'setHomePage', isHome })
		}
	},
	mounted() {
		this.setHomePage(true)

	},
	unmounted() {
		console.log('umounted app vue')
		this.setHomePage(false)
	},
	computed: {
		isHomePage() {
			return this.$store.getters.isHomePage
		}
	},
	components: {
	}
}
</script>

<style>
.navbar.vue-fixed-header--isFixed {
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
}
</style>
