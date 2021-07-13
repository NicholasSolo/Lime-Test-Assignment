import MD5 from "crypto-js/md5";

const auth = () => {
    const form = document.getElementById("login");
    const profileLink = document.querySelector(".profile-link");
    const errorPopup = document.querySelector(".error-popup");
    const errorMsg = document.querySelector(".error-msg");

    const postData = body =>
        fetch("https://mc-l.ru/test/api.login.php", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(body),
        });

    profileLink.addEventListener("click", e => {
        e.preventDefault();

        fetch("https://mc-l.online/test/api.check-login.php", {
            method: "GET",
            headers: { "Content-Type": "text/plain" },
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error("network failed");
                }
                return response.json();
            })
            .then(data => {
                if (data.auth === "success") {
                    window.location.href = "./profile.html";
                } else {
                    window.location.href = "./login.html";
                }
            })
            .catch(e => console.log(e));
    });

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const formData = new FormData(form);
            const body = {};
            for (const value of formData.entries()) {
                body[value[0]] = value[1];
            }
            body.password = MD5(body.password).toString();
            form.reset();

            postData(body)
                .then(response => {
                    if (response.status !== 200) {
                        throw new Error("network failed");
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.status === "Success") {
                        localStorage.setItem("authToken", JSON.stringify(data.code));
                        window.location.href = "./profile.html";
                    } else {
                        errorPopup.style.display = "flex";
                        errorMsg.textContent = data.code;

                        setTimeout(() => {
                            errorPopup.style.display = "";
                            errorMsg.textContent = "";
                        }, 2000);
                    }
                });
        });
    }
};

export default auth;
