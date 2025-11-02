import org.junit.Test;
import static org.junit.Assert.*;
import shape.Triangle;

public class BaoNguyen {

    @Test
    public void testEqualateral() {
        Triangle t = new Triangle(3, 3, 3);
        assertEquals("Equalateral", t.triangleType());
    }

    @Test
    public void testIsosceles() {
        Triangle t = new Triangle(4, 4, 6);
        assertEquals("Isosceles", t.triangleType());
    }

    @Test
    public void testScalene() {
        Triangle t = new Triangle(3, 4, 5);
        assertEquals("Scalene", t.triangleType());
    }

    @Test
    public void testNotTriangle() {
        Triangle t = new Triangle(1, 2, 3);  // fails triangle inequality
        assertEquals("Not a Triangle", t.triangleType());
    }

    @Test
    public void testZeroSide() {
        Triangle t = new Triangle(0, 4, 5);
        assertEquals("Not a Triangle", t.triangleType());
    }

    @Test
    public void testNegativeSide() {
        Triangle t = new Triangle(-3, 4, 5);
        assertEquals("Not a Triangle", t.triangleType());
    }
}
