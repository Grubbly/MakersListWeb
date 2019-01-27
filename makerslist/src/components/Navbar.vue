<template>
    <div class="navbar">
        <!-- Position nav at top of page -->
        <nav class="nav-extended indigo darken-2">
            <div class="nav-content">
                <router-link to="">
                    <span class="nav-title">MakersList</span>
                </router-link>
                <!-- halfway-fab pushes button halfway beyond nav boundary -->
                <a href="" class="btn-floating btn-large halfway-fab orange">
                    <router-link to="">
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
