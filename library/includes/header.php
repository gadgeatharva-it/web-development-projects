<div class="navbar navbar-inverse set-radius-zero">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">
                <!-- Placeholder for logo -->
                <img src="https://i.ibb.co/hY8yCCj/Dr-BABASAHEB.png" alt="Logo" style="max-height: 50px;">
                <span class="university-name">Dr. Babasaheb Ambedkar Technological University, Lonere, Raigad</span>
            </a>
        </div>
        <?php if ($_SESSION['login']) { ?>
            <div class="right-div">
                <a href="logout.php" class="btn btn-danger pull-right">LOG ME OUT</a>
            </div>
        <?php } ?>
    </div>
</div>
<!-- LOGO HEADER END -->

<!-- Add your styles -->
<style>
    .university-name {
        font-family: 'Georgia', serif;
        font-size: 20px;
        font-weight: bold;
        color: #ffffff;
        margin-left: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .navbar-inverse {
        background-color:rgb(44, 141, 237); /* Dark blue */
        border-color:rgb(35, 130, 225);
    }

    .navbar-brand:hover .university-name {
        color: #18bc9c; /* Aqua green */
        text-decoration: underline;
    }
</style>

<!-- LOGO HEADER END -->

<?php if ($_SESSION['login']) { ?>
    <section class="menu-section">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="navbar-collapse collapse">
                        <ul id="menu-top" class="nav navbar-nav navbar-right">
                            <li><a href="dashboard.php" class="menu-top-active">DASHBOARD</a></li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                    Account <i class="fa fa-angle-down"></i>
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a href="my-profile.php">My Profile</a></li>
                                    <li><a href="change-password.php">Change Password</a></li>
                                </ul>
                            </li>
                            <!-- <li><a href="manage-books.php">Issued Books</a></li> -->
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
<?php } else { ?>
    <section class="menu-section">
        <div class="container">
            <div class="row">
                <div class="col-md-12 text-center">
                    <label for="navigation" class="form-label" style="margin-bottom: 15px; display: block; font-size: 18px; font-weight: 600; color: #2575fc;">
                        Select an option:
                    </label>
                    <select id="navigation" name="navigation" class="form-control" style="width: auto; margin: 0 auto; display: inline-block;" onchange="navigateToPage()">
                        <option value="">--Select--</option>
                        <option value="index.php">User Login</option>
                        <option value="adminlogin.php">Admin Login</option>
                        <option value="signup.php">Sign-up</option>
                    </select>
                </div>
            </div>
        </div>
    </section>
    <script>
        function navigateToPage() {
            var selectBox = document.getElementById("navigation");
            var selectedValue = selectBox.value;
            if (selectedValue) {
                window.location.href = selectedValue;
            }
        }
    </script>
<?php } ?>


