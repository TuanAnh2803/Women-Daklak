let currentScreen = 1;

let selectedCommitments = [];

let isDrawing = false;

let hasSignature = false;


const canvas =
    document.getElementById("signatureCanvas");

const ctx =
    canvas.getContext("2d");


const fullName =
    document.getElementById("fullName");

const organization =
    document.getElementById("organization");

const commitmentChecks =
    document.querySelectorAll(".commitmentCheck");

function showScreen(number) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });


    const target =
        document.getElementById(
            "screen" + number
        );


    if (target) {

        target.classList.add("active");

    }


    currentScreen = number;


    updateSteps(number);


    if (number === 3) {

        setTimeout(() => {

            resizeCanvas();

        }, 50);

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function updateSteps(number) {

    document
        .querySelectorAll(".step")
        .forEach(step => {

            step.classList.remove("active");

        });


    if (
        number >= 1 &&
        number <= 3
    ) {

        document
            .getElementById(
                "stepIndicator" + number
            )
            .classList.add("active");

    }

}

document
    .getElementById("nextInfoButton")
    .addEventListener(
        "click",
        function () {

            const name =
                fullName.value.trim();


            if (!name) {

                alert(
                    "Vui lòng nhập họ và tên."
                );

                fullName.focus();

                return;

            }


            showScreen(2);

        }
    );


document
    .getElementById("backToInfo")
    .addEventListener(
        "click",
        function () {

            showScreen(1);

        }
    );


document
    .getElementById("nextCommitment")
    .addEventListener(
        "click",
        function () {

            const checked =
                document.querySelectorAll(
                    ".commitmentCheck:checked"
                );


            if (checked.length === 0) {

                alert(
                    "Vui lòng chọn ít nhất một nội dung cam kết."
                );

                return;

            }


            selectedCommitments =
                [...checked].map(
                    item => item.value
                );


            showScreen(3);

        }
    );


commitmentChecks.forEach(check => {

    check.addEventListener(
        "change",
        function () {

            const parent =
                this.closest(".commitment");


            if (this.checked) {

                parent.classList.add(
                    "selected"
                );

            } else {

                parent.classList.remove(
                    "selected"
                );

            }

        }
    );

});


document
    .getElementById("selectAllButton")
    .addEventListener(
        "click",
        function () {

            const allChecked =
                [...commitmentChecks]
                    .every(
                        check => check.checked
                    );


            commitmentChecks.forEach(
                check => {

                    check.checked =
                        !allChecked;


                    const parent =
                        check.closest(
                            ".commitment"
                        );


                    if (check.checked) {

                        parent.classList.add(
                            "selected"
                        );

                    } else {

                        parent.classList.remove(
                            "selected"
                        );

                    }

                }
            );


            this.textContent =
                allChecked
                    ? "Chọn tất cả"
                    : "Bỏ chọn tất cả";

        }
    );


document
    .getElementById("backToCommitment")
    .addEventListener(
        "click",
        function () {

            showScreen(2);

        }
    );


function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();


    const ratio =
        window.devicePixelRatio || 1;


    const oldImage =
        hasSignature
            ? canvas.toDataURL()
            : null;


    canvas.width =
        rect.width * ratio;


    canvas.height =
        rect.height * ratio;


    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    ctx.lineWidth = 2.5;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.strokeStyle = "#222";


    if (oldImage) {

        const image =
            new Image();


        image.onload = function () {

            ctx.drawImage(
                image,
                0,
                0,
                rect.width,
                rect.height
            );

        };


        image.src = oldImage;

    }

}


function getPosition(event) {

    const rect =
        canvas.getBoundingClientRect();


    let clientX;
    let clientY;


    if (
        event.touches &&
        event.touches.length
    ) {

        clientX =
            event.touches[0].clientX;

        clientY =
            event.touches[0].clientY;

    } else {

        clientX =
            event.clientX;

        clientY =
            event.clientY;

    }


    return {

        x: clientX - rect.left,

        y: clientY - rect.top

    };

}


function startDrawing(event) {

    event.preventDefault();


    isDrawing = true;

    hasSignature = true;


    const position =
        getPosition(event);


    ctx.beginPath();

    ctx.moveTo(
        position.x,
        position.y
    );


    hideSignaturePlaceholder();

}


function draw(event) {

    if (!isDrawing) {
        return;
    }


    event.preventDefault();


    const position =
        getPosition(event);


    ctx.lineTo(
        position.x,
        position.y
    );


    ctx.stroke();

}


function stopDrawing(event) {

    if (event) {

        event.preventDefault();

    }


    isDrawing = false;

    ctx.closePath();

}


canvas.addEventListener(
    "mousedown",
    startDrawing
);


canvas.addEventListener(
    "mousemove",
    draw
);


canvas.addEventListener(
    "mouseup",
    stopDrawing
);


canvas.addEventListener(
    "mouseleave",
    stopDrawing
);


/* =================================================
   TOUCH
================================================= */

canvas.addEventListener(
    "touchstart",
    startDrawing,
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchmove",
    draw,
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchend",
    stopDrawing,
    {
        passive: false
    }
);

function hideSignaturePlaceholder() {

    const placeholder =
        document.querySelector(
            ".signature-placeholder"
        );


    if (placeholder) {

        placeholder.style.display =
            "none";

    }

}


document
    .getElementById("clearSignature")
    .addEventListener(
        "click",
        function () {

            const rect =
                canvas.getBoundingClientRect();


            ctx.clearRect(
                0,
                0,
                rect.width,
                rect.height
            );


            hasSignature = false;


            const placeholder =
                document.querySelector(
                    ".signature-placeholder"
                );


            if (placeholder) {

                placeholder.style.display =
                    "block";

            }

        }
    );


document
    .getElementById("submitButton")
    .addEventListener(
        "click",
        function () {

            const name =
                fullName.value.trim();


            if (!name) {

                alert(
                    "Không tìm thấy họ tên."
                );

                showScreen(1);

                return;

            }


            if (
                selectedCommitments.length === 0
            ) {

                alert(
                    "Vui lòng chọn nội dung cam kết."
                );

                showScreen(2);

                return;

            }


            if (!hasSignature) {

                alert(
                    "Vui lòng ký tên trước khi hoàn tất."
                );

                return;

            }


            const data = {

                id: Date.now(),

                name: name,

                organization:
                    organization.value.trim(),

                commitments:
                    selectedCommitments,

                signature:
                    canvas.toDataURL(
                        "image/png"
                    ),

                createdAt:
                    new Date().toISOString()

            };


            /*
             * LƯU TẠM LOCAL STORAGE
             *
             * Sau này thay bằng Firebase.
             */

            const oldData =
                JSON.parse(
                    localStorage.getItem(
                        "commitments"
                    ) || "[]"
                );


            oldData.push(data);


            localStorage.setItem(
                "commitments",
                JSON.stringify(oldData)
            );


            showScreenSuccess();

        }
    );


function showScreenSuccess() {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove(
                "active"
            );

        });


    document
        .getElementById("successScreen")
        .classList.add("active");


    document
        .querySelectorAll(".step")
        .forEach(step => {

            step.classList.remove(
                "active"
            );

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


document
    .getElementById("newCommitment")
    .addEventListener(
        "click",
        function () {

            fullName.value = "";

            organization.value = "";


            commitmentChecks.forEach(
                check => {

                    check.checked = false;

                    check
                        .closest(".commitment")
                        .classList
                        .remove("selected");

                }
            );


            selectedCommitments = [];


            document
                .getElementById(
                    "selectAllButton"
                )
                .textContent =
                "Chọn tất cả";


            clearCanvas();


            showScreen(1);

        }
    );

function clearCanvas() {

    const rect =
        canvas.getBoundingClientRect();


    ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );


    hasSignature = false;


    const placeholder =
        document.querySelector(
            ".signature-placeholder"
        );


    if (placeholder) {

        placeholder.style.display =
            "block";

    }

}

window.addEventListener(
    "resize",
    function () {

        if (currentScreen === 3) {

            resizeCanvas();

        }

    }
);


/* =================================================
   KHỞI TẠO
================================================= */

showScreen(1);