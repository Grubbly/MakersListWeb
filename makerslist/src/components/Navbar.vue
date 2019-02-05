<template>
    <div class="navbar">
        <!-- Position nav at top of page -->
        <nav class="nav-extended cyan darken-4">
            <div class="nav-content">
                <router-link :to="{name: 'Index'}">
                    <!-- <img  src='/static/DepthLogo.png' width=100px height=100px style="padding: 0;"/> -->
                    <span class="nav-title">
                        MakersList
                    </span>
                    
                </router-link>
                <!-- halfway-fab pushes button halfway beyond nav boundary -->
                <a href="" class="btn-floating btn-large halfway-fab orange">
                    <router-link :to="{name: 'AddList'}">
                        <!-- <i> for icon "add" is the name of the icon -->
                        <i class="material-icons">add</i>
                    </router-link>
                </a>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'Navbar',
    data() {
        return {

        }
    }
}
</script>

<style>
.navbar nav {
    padding: 0 20px;
}
</style>
