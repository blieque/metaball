const distance = function distance(aX, aY, bX, bY) {
    return Math.sqrt(
        ((aX - bX) ** 2) +
        ((aY - bY) ** 2)
    );
};
