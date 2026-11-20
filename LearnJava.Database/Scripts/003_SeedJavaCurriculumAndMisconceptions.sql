-- Seed initial Java curriculum, misconceptions, lesson variants, and quiz questions.

BEGIN TRANSACTION;

-- Misconceptions

-- 1. MISC_EQUALS_REF
IF NOT EXISTS (SELECT 1 FROM dbo.Misconceptions WHERE Code = 'MISC_EQUALS_REF')
BEGIN
    INSERT INTO dbo.Misconceptions (Id, Code, Title, Explanation, CorrectiveAdvice)
    VALUES (
        '11111111-1111-1111-1111-111111111101',
        'MISC_EQUALS_REF',
        'Reference vs Semantic Equality (== vs .equals())',
        'Believing that the == operator compares the internal values of objects or strings, rather than memory references.',
        'Use == only for primitive types (int, boolean, etc.) or when checking if two references point to the exact same object instance. Use .equals() when comparing the semantic content of objects like String, Integer, or custom domain classes.'
    );
END;

-- 2. MISC_PASS_BY_REF
IF NOT EXISTS (SELECT 1 FROM dbo.Misconceptions WHERE Code = 'MISC_PASS_BY_REF')
BEGIN
    INSERT INTO dbo.Misconceptions (Id, Code, Title, Explanation, CorrectiveAdvice)
    VALUES (
        '11111111-1111-1111-1111-111111111102',
        'MISC_PASS_BY_REF',
        'Pass-by-Reference in Java Methods',
        'Believing that Java passes objects by reference into methods, expecting reassigning the parameter variable inside the method to change the caller''s reference.',
        'Java is always pass-by-value. When an object is passed, the value being copied is the reference handle (pointer value). Modifying the object''s internal state mutates the shared instance, but reassigning the parameter (e.g. obj = new Object()) only updates the local stack copy.'
    );
END;

-- 3. MISC_ARRAY_BOUNDS
IF NOT EXISTS (SELECT 1 FROM dbo.Misconceptions WHERE Code = 'MISC_ARRAY_BOUNDS')
BEGIN
    INSERT INTO dbo.Misconceptions (Id, Code, Title, Explanation, CorrectiveAdvice)
    VALUES (
        '11111111-1111-1111-1111-111111111103',
        'MISC_ARRAY_BOUNDS',
        '1-Based Indexing & Array Bounds Confusion',
        'Assuming array indices are 1-based or attempting to access index array.length directly.',
        'Java arrays are zero-indexed: valid indices range strictly from 0 to array.length - 1. Accessing index array.length immediately triggers an ArrayIndexOutOfBoundsException.'
    );
END;

-- 4. MISC_STATIC_INSTANCE
IF NOT EXISTS (SELECT 1 FROM dbo.Misconceptions WHERE Code = 'MISC_STATIC_INSTANCE')
BEGIN
    INSERT INTO dbo.Misconceptions (Id, Code, Title, Explanation, CorrectiveAdvice)
    VALUES (
        '11111111-1111-1111-1111-111111111104',
        'MISC_STATIC_INSTANCE',
        'Direct Access of Instance State from Static Scope',
        'Attempting to access instance variables or call non-static methods directly from a static context (like public static void main) without creating an instance.',
        'Static members belong to the class blueprint, loaded once. Instance members belong to individual heap instances. To use instance members inside static methods, you must instantiate the class first (new MyClass().field).'
    );
END;

-- 5. MISC_INT_DIVISION
IF NOT EXISTS (SELECT 1 FROM dbo.Misconceptions WHERE Code = 'MISC_INT_DIVISION')
BEGIN
    INSERT INTO dbo.Misconceptions (Id, Code, Title, Explanation, CorrectiveAdvice)
    VALUES (
        '11111111-1111-1111-1111-111111111105',
        'MISC_INT_DIVISION',
        'Integer Division Truncation',
        'Expecting division of two integer primitives to produce a decimal fraction (e.g., expecting 1 / 2 to equal 0.5).',
        'In Java, dividing two integers always performs floor integer division, discarding the remainder. 1 / 2 evaluates to 0. To obtain a floating-point result, cast at least one operand: (double) 1 / 2 or 1.0 / 2.'
    );
END;

-- 6. MISC_STRING_MUTATION
IF NOT EXISTS (SELECT 1 FROM dbo.Misconceptions WHERE Code = 'MISC_STRING_MUTATION')
BEGIN
    INSERT INTO dbo.Misconceptions (Id, Code, Title, Explanation, CorrectiveAdvice)
    VALUES (
        '11111111-1111-1111-1111-111111111106',
        'MISC_STRING_MUTATION',
        'String In-Place Mutability Assumption',
        'Believing that String transformation methods (like toUpperCase(), replace(), or substring()) mutate the existing String object in-place.',
        'Java String objects are strictly immutable. Any method that appears to modify a String actually creates and returns a brand new String on the heap. You must reassign the return value: str = str.toUpperCase();.'
    );
END;

-- 7. MISC_AUTOBOX_NPE
IF NOT EXISTS (SELECT 1 FROM dbo.Misconceptions WHERE Code = 'MISC_AUTOBOX_NPE')
BEGIN
    INSERT INTO dbo.Misconceptions (Id, Code, Title, Explanation, CorrectiveAdvice)
    VALUES (
        '11111111-1111-1111-1111-111111111107',
        'MISC_AUTOBOX_NPE',
        'Unboxing Null Wrapper to Primitive (NullPointerException)',
        'Expecting null wrapper objects (like Integer, Double, or Boolean) to unbox to default primitive values (0, 0.0, or false) during arithmetic or logical evaluations.',
        'Unboxing implicitly calls helper methods like .intValue() or .booleanValue() on the wrapper instance. If the reference is null, the JVM throws an immediate NullPointerException. Always null-check wrappers before unboxing.'
    );
END;

-- 8. MISC_POLYMORPHIC_FIELD
IF NOT EXISTS (SELECT 1 FROM dbo.Misconceptions WHERE Code = 'MISC_POLYMORPHIC_FIELD')
BEGIN
    INSERT INTO dbo.Misconceptions (Id, Code, Title, Explanation, CorrectiveAdvice)
    VALUES (
        '11111111-1111-1111-1111-111111111108',
        'MISC_POLYMORPHIC_FIELD',
        'Polymorphic Field Dispatch & Variable Shadowing',
        'Believing that instance variables (fields) or static methods participate in dynamic polymorphic method dispatch at runtime.',
        'In Java, only instance methods are polymorphic (virtual dispatch). Fields and static methods are bound at compile time based on the declared reference type, not the runtime object instance.'
    );
END;

-- Lessons

-- Lesson 1: Memory Model
IF NOT EXISTS (SELECT 1 FROM dbo.Lessons WHERE Id = '22222222-2222-2222-2222-222222222201')
BEGIN
    INSERT INTO dbo.Lessons (Id, Title, Summary, Difficulty, OrderIndex)
    VALUES (
        '22222222-2222-2222-2222-222222222201',
        'Java Memory: Primitives vs Reference Types',
        'Distinction between stack-allocated primitive values and heap-allocated object references.',
        0, -- Beginner
        1
    );
END;

-- Lesson 2: Equality
IF NOT EXISTS (SELECT 1 FROM dbo.Lessons WHERE Id = '22222222-2222-2222-2222-222222222202')
BEGIN
    INSERT INTO dbo.Lessons (Id, Title, Summary, Difficulty, OrderIndex)
    VALUES (
        '22222222-2222-2222-2222-222222222202',
        'Object & String Equality (== vs .equals)',
        'Difference between reference comparison (==) and content comparison (.equals()), including how the String pool works.',
        0, -- Beginner
        2
    );
END;

-- Lesson 3: Arrays
IF NOT EXISTS (SELECT 1 FROM dbo.Lessons WHERE Id = '22222222-2222-2222-2222-222222222203')
BEGIN
    INSERT INTO dbo.Lessons (Id, Title, Summary, Difficulty, OrderIndex)
    VALUES (
        '22222222-2222-2222-2222-222222222203',
        'Arrays and Zero-Based Indexing',
        'How Java allocates arrays in heap memory, zero-based indexing rules, and common off-by-one errors.',
        0, -- Beginner
        3
    );
END;

-- Lesson 4: Pass by Value
IF NOT EXISTS (SELECT 1 FROM dbo.Lessons WHERE Id = '22222222-2222-2222-2222-222222222204')
BEGIN
    INSERT INTO dbo.Lessons (Id, Title, Summary, Difficulty, OrderIndex)
    VALUES (
        '22222222-2222-2222-2222-222222222204',
        'Methods and Pass-by-Value',
        'Why Java is always pass-by-value and how object references behave when passed to methods.',
        1, -- Intermediate
        4
    );
END;

-- Lesson 5: Static vs Instance
IF NOT EXISTS (SELECT 1 FROM dbo.Lessons WHERE Id = '22222222-2222-2222-2222-222222222205')
BEGIN
    INSERT INTO dbo.Lessons (Id, Title, Summary, Difficulty, OrderIndex)
    VALUES (
        '22222222-2222-2222-2222-222222222205',
        'Static vs Instance Members',
        'Lifecycle differences between class-level static members and object instance fields and methods.',
        1, -- Intermediate
        5
    );
END;

-- Lesson 6: String Immutability & StringBuilder
IF NOT EXISTS (SELECT 1 FROM dbo.Lessons WHERE Id = '22222222-2222-2222-2222-222222222206')
BEGIN
    INSERT INTO dbo.Lessons (Id, Title, Summary, Difficulty, OrderIndex)
    VALUES (
        '22222222-2222-2222-2222-222222222206',
        'String Immutability and StringBuilder',
        'Why String objects cannot be modified in place and how StringBuilder avoids repeated heap allocations.',
        1, -- Intermediate
        6
    );
END;

-- Lesson 7: Wrapper Classes & Autoboxing
IF NOT EXISTS (SELECT 1 FROM dbo.Lessons WHERE Id = '22222222-2222-2222-2222-222222222207')
BEGIN
    INSERT INTO dbo.Lessons (Id, Title, Summary, Difficulty, OrderIndex)
    VALUES (
        '22222222-2222-2222-2222-222222222207',
        'Wrapper Classes and Autoboxing',
        'Primitive wrapper classes, the Integer cache (-128 to 127), and NullPointerException cases during unboxing.',
        2, -- Advanced
        7
    );
END;

-- Lesson 8: Polymorphism & Field Shadowing
IF NOT EXISTS (SELECT 1 FROM dbo.Lessons WHERE Id = '22222222-2222-2222-2222-222222222208')
BEGIN
    INSERT INTO dbo.Lessons (Id, Title, Summary, Difficulty, OrderIndex)
    VALUES (
        '22222222-2222-2222-2222-222222222208',
        'Inheritance, Polymorphism & Field Shadowing',
        'Dynamic method dispatch versus compile-time field binding, and how variable shadowing works in subclasses.',
        2, -- Advanced
        8
    );
END;

-- Lesson content variants (Visual, Practical, Conceptual)

-- Lesson 1 Variants
IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222201' AND Style = 0)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333331001',
        '22222222-2222-2222-2222-222222222201',
        0, -- Visual
        '# Java Memory: Stack vs Heap

```
+------------------ STACK -------------------+   +------------------- HEAP --------------------+
|                                            |   |                                             |
|  [main() Frame]                            |   |                                             |
|  int age = 25;              (Direct Value) |   |                                             |
|  boolean isActive = true;   (Direct Value) |   |                                             |
|  Student s = 0x4A1F; ------(Pointer)------->-->| [0x4A1F: Student Object]                    |
|                                            |   |   name = "Alice"                            |
|                                            |   |   gpa = 3.8                                 |
+--------------------------------------------+   +---------------------------------------------+
```

### Summary
- **Primitives (`byte`, `short`, `int`, `long`, `float`, `double`, `boolean`, `char`)**: The raw binary bits live directly in the thread stack frame.
- **Reference Types (`Objects`, `Arrays`, `Strings`)**: The stack holds an address pointer. The actual object payload lives in the Garbage-Collected Heap.
- **Integer Division**: Dividing two ints executes between stack slots and drops fractions: `1 / 2 == 0`.'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222201' AND Style = 1)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333331002',
        '22222222-2222-2222-2222-222222222201',
        1, -- Practical
        '# Working with Primitives and References

Run this experiment to observe how primitive copies and reference handles diverge:

```java
public class MemoryExperiment {
    public static void main(String[] args) {
        // Primitives copy raw bits
        int a = 10;
        int b = a;
        b = 20;
        System.out.println("a: " + a); // Prints 10

        // References copy memory pointers
        StringBuilder sb1 = new StringBuilder("Hello");
        StringBuilder sb2 = sb1;
        sb2.append(" World");
        System.out.println("sb1: " + sb1); // Prints "Hello World"
        
        // Integer division:
        int result = 5 / 2;
        System.out.println("5 / 2 = " + result); // Prints 2, NOT 2.5
    }
}
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222201' AND Style = 2)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333331003',
        '22222222-2222-2222-2222-222222222201',
        2, -- Conceptual
        '# Java Memory Model

Java eliminates raw C pointer arithmetic while preserving execution performance through managed dual memory spaces:
- **Thread Call Stack**: Fast memory allocations where primitive variables are allocated and reclaimed deterministically upon return.
- **Garbage-Collected Heap**: Shared dynamic storage for objects of arbitrary lifecycles.
- **Typing Rule**: Arithmetic operators like `/` are type-determined. If both operands are integer types, integer truncation applies.'
    );
END;

-- Lesson 2 Variants
IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222202' AND Style = 0)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333332001',
        '22222222-2222-2222-2222-222222222202',
        0, -- Visual
        '# Reference vs Content Equality: Visual Guide

```
String s1 = "java";             // Reuses String Pool entry 0x100
String s2 = "java";             // Reuses String Pool entry 0x100
String s3 = new String("java"); // Force-allocated at Heap 0x900

   s1 (0x100) -----|
                    +---> [ "java" ] in String Constant Pool
   s2 (0x100) -----|

   s3 (0x900) ----------> [ "java" ] on Regular Heap

Comparisons:
s1 == s2 --> TRUE  (Identical memory address: 0x100 == 0x100)
s1 == s3 --> FALSE (Different addresses: 0x100 != 0x900)
s1.equals(s3) --> TRUE  (Character by character equivalence)
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222202' AND Style = 1)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333332002',
        '22222222-2222-2222-2222-222222222202',
        1, -- Practical
        '# Practical Equality Rules: Never Use == on Objects

```java
public class EqualityLab {
    public static void main(String[] args) {
        String input = new Scanner("admin").next();
        
        // BUGGY:
        if (input == "admin") {
            System.out.println("Will never run.");
        }

        // CORRECT:
        if ("admin".equals(input)) {
            System.out.println("Safe and null-proof.");
        }
    }
}
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222202' AND Style = 2)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333332003',
        '22222222-2222-2222-2222-222222222202',
        2, -- Conceptual
        '# Equivalence Relations vs Memory Identity

In Java OOP, equality has two distinct definitions:
1. **Identity (Sameness)**: Do reference handles point to the exact same physical byte sequence in RAM? Checked via `==`.
2. **Equivalence (Semantic Value)**: Do two distinct instances contain identical logical states? Checked via `.equals()`.
When designing classes, always override `hashCode()` whenever overriding `equals()`.'
    );
END;

-- Lesson 3 Variants
IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222203' AND Style = 0)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333333001',
        '22222222-2222-2222-2222-222222222203',
        0, -- Visual
        '# Java Array Bounds: Memory Layout

```
int[] nums = new int[3]; // length = 3

   Index:      [ 0 ]    [ 1 ]    [ 2 ]     -- Valid Bounds: 0 to length - 1
   Address:    0x10     0x14     0x18
   Value:        0        0        0       -- Zero-initialized by default

   nums[3] -> EXCEPTION: throws ArrayIndexOutOfBoundsException.
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222203' AND Style = 1)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333333002',
        '22222222-2222-2222-2222-222222222203',
        1, -- Practical
        '# Array Loop Safety Patterns

```java
int[] items = { 10, 20, 30 };

// SAFE FOR LOOP:
for (int i = 0; i < items.length; i++) {
    System.out.println(items[i]);
}

// SAFE ENHANCED FOR LOOP:
for (int item : items) {
    System.out.println(item);
}
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222203' AND Style = 2)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333333003',
        '22222222-2222-2222-2222-222222222203',
        2, -- Conceptual
        '# Array Invariants & JVM Memory Protection

Unlike C where buffer overflows allow arbitrary memory access, Java enforces strict runtime bounds verification on every array indexing bytecode (`iaload`, `iastore`). Any out-of-bounds index immediately faults with an unchecked `ArrayIndexOutOfBoundsException`.'
    );
END;

-- Lesson 4 Variants
IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222204' AND Style = 0)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333334001',
        '22222222-2222-2222-2222-222222222204',
        0, -- Visual
        '# Pass by Value: Stack Frame Visualization

```
[caller() Frame]                [modify() Frame]
greeting = 0x55AA ----------->  sb = 0x55AA
                                sb = 0x99BB (Reassigned to new object)

HEAP:
[0x55AA: "Hello"]  <-- greeting still points here.
[0x99BB: "World"]  <-- sb pointed here, then modify() frame stopped.
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222204' AND Style = 1)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333334002',
        '22222222-2222-2222-2222-222222222204',
        1, -- Practical
        '# Mutating Object State vs Reassigning Handles

```java
void addTag(List<String> list) {
    list.add("Java"); // Mutates shared heap object.
}

void reassign(List<String> list) {
    list = new ArrayList<>(); // Reassigns local stack variable only.
}
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222204' AND Style = 2)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333334003',
        '22222222-2222-2222-2222-222222222204',
        2, -- Conceptual
        '# Java Language Specification: Strictly Pass-by-Value

Java has no syntax or semantics for pass-by-reference (unlike C++ `&` or C# `ref`). Whether passing an `int` or a `Socket`, Java pushes a copy of the 32/64-bit value onto the callee stack frame.'
    );
END;

-- Lesson 5 Variants
IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222205' AND Style = 0)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333335001',
        '22222222-2222-2222-2222-222222222205',
        0, -- Visual
        '# Static vs Instance Lifecycle Diagram

```
Class Blueprint Area (Metaspace):
+-------------------------------+
| Counter.class                 |
|   static int count = 2;       | <- Shared across all instances.
+-------------------------------+

Heap Allocations:
+-------------------+      +-------------------+
| Instance 0x01     |      | Instance 0x02     |
|   int id = 101;   |      |   int id = 102;   |
+-------------------+      +-------------------+
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222205' AND Style = 1)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333335002',
        '22222222-2222-2222-2222-222222222205',
        1, -- Practical
        '# Calling Static Methods Properly

```java
public class Service {
    public static void printHelp() { System.out.println("Help"); }
    
    public static void main(String[] args) {
        // Preferred: Call via class name
        Service.printHelp();

        // Legal in Java, but bad practice:
        Service s = null;
        s.printHelp(); // Does NOT throw NullPointerException, compiler binds automatically to Service.printHelp()
    }
}
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222205' AND Style = 2)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333335003',
        '22222222-2222-2222-2222-222222222205',
        2, -- Conceptual
        '# Static Binding vs Instance Polymorphism

Static methods and fields are loaded once when the classloader resolves the `.class` file. Because no runtime `this` pointer is passed to static invocations (`invokestatic`), instance fields cannot be accessed directly without an explicit instance reference.'
    );
END;

-- Lesson 6 Variants
IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222206' AND Style = 0)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333336001',
        '22222222-2222-2222-2222-222222222206',
        0, -- Visual
        '# String Immutability vs StringBuilder: Visual Guide

```
String Operation:
   String str = "hello";       // 0x111: [ "hello" ]
   str.concat(" world");       // 0x222: [ "hello world" ]
   // str is still pointing to 0x111, "hello" was not mutated.

StringBuilder Operation:
   StringBuilder sb = new StringBuilder("hello"); // 0x555 internal char[] buffer
   sb.append(" world");        // 0x555 internal buffer expanded in-place.
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222206' AND Style = 1)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333336002',
        '22222222-2222-2222-2222-222222222206',
        1, -- Practical
        '# String Transformation Lab

```java
public class StringLab {
    public static void main(String[] args) {
        String greeting = "hi";
        greeting.toUpperCase();
        System.out.println(greeting); // Still prints "hi".

        greeting = greeting.toUpperCase();
        System.out.println(greeting); // Now prints "HI".

        // Use StringBuilder for loops:
        StringBuilder log = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            log.append(i).append(" ");
        }
        System.out.println(log.toString());
    }
}
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222206' AND Style = 2)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333336003',
        '22222222-2222-2222-2222-222222222206',
        2, -- Conceptual
        '# Why Strings Are Immutable

In Java, `String` is final and immutable for three reasons:
1. **Security**: Strings carry database URLs, usernames, file paths, and network sockets. Immutability prevents TOCTOU (Time of Check to Time of Use) exploits.
2. **String Pool Caching**: Reusing identical string literals requires that no caller can mutate the shared instance.
3. **Thread Safety**: Immutable instances are inherently thread-safe without synchronization locks.'
    );
END;

-- Lesson 7 Variants
IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222207' AND Style = 0)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333337001',
        '22222222-2222-2222-2222-222222222207',
        0, -- Visual
        '# Autoboxing & The Integer Cache Pool

```
Integer Cache (-128 to +127):
Integer a = 100;  -> Points to cached Integer at 0xCA01
Integer b = 100;  -> Points to same cached Integer at 0xCA01
a == b            -> TRUE

Outside Cache (>= 128):
Integer c = 200;  -> Allocates NEW heap object at 0x88AA
Integer d = 200;  -> Allocates NEW heap object at 0x99BB
c == d            -> FALSE! (Use c.equals(d) instead)

Unboxing a null wrapper:
Integer count = null;
int val = count;  -> JVM invokes count.intValue() --> Throws NullPointerException exception.
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222207' AND Style = 1)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333337002',
        '22222222-2222-2222-2222-222222222207',
        1, -- Practical
        '# Safe Unboxing Defensive Coding

```java
public class BoxingLab {
    public static void main(String[] args) {
        Integer userScore = null;

        // UNSAFE:
        // int total = userScore + 10; // Throws NullPointerException exception.

        // SAFE:
        int total = (userScore != null ? userScore : 0) + 10;
        System.out.println("Safe total: " + total);
    }
}
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222207' AND Style = 2)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333337003',
        '22222222-2222-2222-2222-222222222207',
        2, -- Conceptual
        '# How Autoboxing Compiles to Bytecode

Autoboxing is purely a compiler convenience (`javac`). When writing `int x = myIntegerObject;`, the compiler injects `invokevirtual java/lang/Integer.intValue:()I`. Because method invocation requires a valid receiver object reference, dereferencing a `null` reference causes an immediate JVM runtime fault.'
    );
END;

-- Lesson 8 Variants
IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222208' AND Style = 0)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333338001',
        '22222222-2222-2222-2222-222222222208',
        0, -- Visual
        '# Virtual Method Dispatch vs Field Shadowing

```
class Parent { int x = 10; void print() { System.out.println("Parent"); } }
class Child extends Parent { int x = 20; void print() { System.out.println("Child"); } }

Parent p = new Child();

p.x       -> 10 (Fields are resolved statically by reference type: Parent)
p.print() -> "Child" (Instance methods are resolved dynamically by runtime object.)
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222208' AND Style = 1)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333338002',
        '22222222-2222-2222-2222-222222222208',
        1, -- Practical
        '# Polymorphism and Field Shadowing Examples

```java
class Vehicle {
    String type = "Generic Vehicle";
    void start() { System.out.println("Vehicle started"); }
}

class Car extends Vehicle {
    String type = "Sports Car";
    @Override
    void start() { System.out.println("Car engine revs."); }
}

public class PolyTest {
    public static void main(String[] args) {
        Vehicle v = new Car();
        System.out.println(v.type); // Prints "Generic Vehicle"!
        v.start();                  // Prints "Car engine revs."!
    }
}
```'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.LessonContentVariants WHERE LessonId = '22222222-2222-2222-2222-222222222208' AND Style = 2)
BEGIN
    INSERT INTO dbo.LessonContentVariants (Id, LessonId, Style, MarkdownBody)
    VALUES (
        '33333333-3333-3333-3333-333333338003',
        '22222222-2222-2222-2222-222222222208',
        2, -- Conceptual
        '# VTable Resolution and Bytecode Instructions

In the Java Virtual Machine:
- **Methods**: Executed via `invokevirtual` which inspects the object header and vtable at runtime, routing to the most specific subclass implementation.
- **Fields**: Accessed via `getfield`, which calculates a fixed offset determined strictly at compile time based on the declared reference variable type.'
    );
END;

-- Diagnostic questions and options

-- Lesson 1 questions

-- Q1.1: Integer Division Truncation
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444441001')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444441001',
        '22222222-2222-2222-2222-222222222201',
        'What will the following Java code print to the console?',
        'int x = 1;' + CHAR(10) + 'int y = 2;' + CHAR(10) + 'double result = x / y;' + CHAR(10) + 'System.out.println(result);',
        'Pay close attention to the types of the operands during the division operation before assignment.',
        1
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555551001',
        '44444444-4444-4444-4444-444444441001',
        '0.5',
        0,
        'Integer division happens first! Since both x and y are ints, 1 / 2 yields 0. The 0 is then widened to double 0.0.',
        '11111111-1111-1111-1111-111111111105' -- MISC_INT_DIVISION
    ),
    (
        '55555555-5555-5555-5555-555555551002',
        '44444444-4444-4444-4444-444444441001',
        '0.0',
        1,
        'Correct! Because both operands are integers, Java executes integer division which truncates to 0, which then widens to 0.0.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555551003',
        '44444444-4444-4444-4444-444444441001',
        'Compilation Error',
        0,
        'Assigning an int result to a double variable is a valid widening primitive conversion and compiles without errors.',
        NULL
    );
END;

-- Q1.2: Primitive Value Copy
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444441002')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444441002',
        '22222222-2222-2222-2222-222222222201',
        'What will be printed when this code snippet runs?',
        'int a = 15;' + CHAR(10) + 'int b = a;' + CHAR(10) + 'b = 30;' + CHAR(10) + 'System.out.println(a);',
        'Recall where primitive variables store their data: on the stack as direct bit representations.',
        2
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555551004',
        '44444444-4444-4444-4444-444444441002',
        '30',
        0,
        'Primitives are not references; copying a primitive variable duplicates its value into a separate stack slot.',
        '11111111-1111-1111-1111-111111111102' -- MISC_PASS_BY_REF
    ),
    (
        '55555555-5555-5555-5555-555555551005',
        '44444444-4444-4444-4444-444444441002',
        '15',
        1,
        'Correct! `b = a` copies the primitive value 15. Mutating `b` has zero impact on `a`.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555551006',
        '44444444-4444-4444-4444-444444441002',
        '45',
        0,
        'Java assignment does not sum or combine variables.',
        NULL
    );
END;

-- Q1.3: Reference Aliasing on Heap
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444441003')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444441003',
        '22222222-2222-2222-2222-222222222201',
        'What will be printed after mutating p2?',
        'class Point { int x = 0; }' + CHAR(10) + 'Point p1 = new Point();' + CHAR(10) + 'Point p2 = p1;' + CHAR(10) + 'p2.x = 99;' + CHAR(10) + 'System.out.println(p1.x);',
        'Consider whether p1 and p2 hold distinct objects or pointers to the same heap object.',
        3
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555551007',
        '44444444-4444-4444-4444-444444441003',
        '0',
        0,
        'p1 and p2 are reference variables referencing the same heap instance. Modifying p2.x mutates the shared instance.',
        '11111111-1111-1111-1111-111111111102' -- MISC_PASS_BY_REF
    ),
    (
        '55555555-5555-5555-5555-555555551008',
        '44444444-4444-4444-4444-444444441003',
        '99',
        1,
        'Correct! `Point p2 = p1` copies the pointer. Both variables point to the same object on the heap, so `p1.x` reflects the change.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555551009',
        '44444444-4444-4444-4444-444444441003',
        'NullPointerException',
        0,
        'Neither p1 nor p2 is null; new Point() successfully allocated the instance.',
        NULL
    );
END;

-- Lesson 2 questions

-- Q2.1: new String Equality
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444442001')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444442001',
        '22222222-2222-2222-2222-222222222202',
        'What will be printed by the comparison expressions below?',
        'String a = new String("code");' + CHAR(10) + 'String b = new String("code");' + CHAR(10) + 'System.out.println((a == b) + " " + a.equals(b));',
        'Remember that `new String()` explicitly creates a distinct object on the heap, bypassing the string constant pool.',
        1
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555552001',
        '44444444-4444-4444-4444-444444442001',
        'true true',
        0,
        'a == b checks memory addresses. Because `new String()` was used twice, two distinct heap instances exist.',
        '11111111-1111-1111-1111-111111111101' -- MISC_EQUALS_REF
    ),
    (
        '55555555-5555-5555-5555-555555552002',
        '44444444-4444-4444-4444-444444442001',
        'false true',
        1,
        'Correct. `a == b` is false because they are distinct heap allocations, while `a.equals(b)` is true because their character content is identical.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555552003',
        '44444444-4444-4444-4444-444444442001',
        'false false',
        0,
        'a.equals(b) compares the characters, which are identical ("code").',
        NULL
    );
END;

-- Q2.2: String Literal Pool
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444442002')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444442002',
        '22222222-2222-2222-2222-222222222202',
        'What does this literal comparison print?',
        'String s1 = "java";' + CHAR(10) + 'String s2 = "java";' + CHAR(10) + 'System.out.println(s1 == s2);',
        'Think about how the Java compiler and JVM optimize identical string literals in class files.',
        2
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555552004',
        '44444444-4444-4444-4444-444444442002',
        'true',
        1,
        'Correct! String literals are interned in the String Constant Pool. Both s1 and s2 reference the exact same memory instance.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555552005',
        '44444444-4444-4444-4444-444444442002',
        'false',
        0,
        'String literals are interned in the constant pool and share the exact same address.',
        '11111111-1111-1111-1111-111111111101' -- MISC_EQUALS_REF
    );
END;

-- Q2.3: Custom Object Default equals()
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444442003')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444442003',
        '22222222-2222-2222-2222-222222222202',
        'What will be printed when u1.equals(u2) is called?',
        'class User { String name = "Sam"; }' + CHAR(10) + 'User u1 = new User();' + CHAR(10) + 'User u2 = new User();' + CHAR(10) + 'System.out.println(u1.equals(u2));',
        'Does the User class override the default equals() implementation inherited from java.lang.Object?',
        3
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555552006',
        '44444444-4444-4444-4444-444444442003',
        'true',
        0,
        'Object.equals() defaults to reference comparison (==). Because User did not override equals(), it compares memory addresses, not field values.',
        '11111111-1111-1111-1111-111111111101' -- MISC_EQUALS_REF
    ),
    (
        '55555555-5555-5555-5555-555555552007',
        '44444444-4444-4444-4444-444444442003',
        'false',
        1,
        'Correct! By default, java.lang.Object defines equals() as `this == obj`. Without an explicit override, it compares addresses.',
        NULL
    );
END;

-- Lesson 3 questions

-- Q3.1: Array Bounds Exception
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444443001')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444443001',
        '22222222-2222-2222-2222-222222222203',
        'What is the outcome of running this snippet?',
        'int[] scores = { 90, 85, 78 };' + CHAR(10) + 'System.out.println(scores[scores.length]);',
        'Check the length of the array and the highest valid index for that length.',
        1
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555553001',
        '44444444-4444-4444-4444-444444443001',
        'It prints 78 (the last score)',
        0,
        'Java arrays are zero-indexed. The last element is at scores[scores.length - 1], not scores[scores.length].',
        '11111111-1111-1111-1111-111111111103' -- MISC_ARRAY_BOUNDS
    ),
    (
        '55555555-5555-5555-5555-555555553002',
        '44444444-4444-4444-4444-444444443001',
        'Throws ArrayIndexOutOfBoundsException',
        1,
        'Correct. The length is 3, but valid indices are 0, 1, and 2. Accessing index 3 exceeds the upper bound.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555553003',
        '44444444-4444-4444-4444-444444443001',
        'It prints 0 (default integer value)',
        0,
        'Out-of-bounds array access in Java never returns default values; it guarantees memory safety by throwing an immediate runtime exception.',
        NULL
    );
END;

-- Q3.2: Array Default Initialization
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444443002')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444443002',
        '22222222-2222-2222-2222-222222222203',
        'What does `arr[0]` evaluate to immediately after creation?',
        'int[] arr = new int[5];' + CHAR(10) + 'System.out.println(arr[0]);',
        'Consider the default initial value of numeric primitive types in heap allocations.',
        2
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555553004',
        '44444444-4444-4444-4444-444444443002',
        '0',
        1,
        'Correct! Java guarantees that all numeric array elements are initialized to 0 upon heap allocation.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555553005',
        '44444444-4444-4444-4444-444444443002',
        'null',
        0,
        'Primitive types cannot be null; only object reference arrays initialize elements to null.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555553006',
        '44444444-4444-4444-4444-444444443002',
        'Compilation Error: uninitialized variable',
        0,
        'Heap array elements are always given safe default values by the JVM runtime.',
        NULL
    );
END;

-- Q3.3: Off-by-one in loop
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444443003')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444443003',
        '22222222-2222-2222-2222-222222222203',
        'What happens when this loop finishes executing?',
        'int[] items = { 1, 2, 3 };' + CHAR(10) + 'for (int i = 0; i <= items.length; i++) {' + CHAR(10) + '    System.out.print(items[i] + " ");' + CHAR(10) + '}',
        'Look carefully at the loop condition: is it < or <= ?',
        3
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555553007',
        '44444444-4444-4444-4444-444444443003',
        'Prints "1 2 3" successfully',
        0,
        'The loop iterates while i <= items.length, so when i == 3, accessing items[3] triggers an exception.',
        '11111111-1111-1111-1111-111111111103' -- MISC_ARRAY_BOUNDS
    ),
    (
        '55555555-5555-5555-5555-555555553008',
        '44444444-4444-4444-4444-444444443003',
        'Prints "1 2 3 " then throws ArrayIndexOutOfBoundsException',
        1,
        'Correct! Elements 0, 1, and 2 print, but when i reaches 3 (which equals items.length), items[3] crashes.',
        NULL
    );
END;

-- Lesson 4 questions

-- Q4.1: Reassigning parameter
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444444001')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444444001',
        '22222222-2222-2222-2222-222222222204',
        'What will be the output when caller() executes?',
        'void modify(StringBuilder sb) {' + CHAR(10) + '    sb = new StringBuilder("World");' + CHAR(10) + '}' + CHAR(10) + 'void caller() {' + CHAR(10) + '    StringBuilder greeting = new StringBuilder("Hello");' + CHAR(10) + '    modify(greeting);' + CHAR(10) + '    System.out.println(greeting);' + CHAR(10) + '}',
        'Consider whether reassigning a parameter variable affects the caller stack variable.',
        1
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555554001',
        '44444444-4444-4444-4444-444444444001',
        'Prints "World"',
        0,
        'Java is pass-by-value. Reassigning `sb = new ...` only alters the local method variable, leaving the caller reference untouched.',
        '11111111-1111-1111-1111-111111111102' -- MISC_PASS_BY_REF
    ),
    (
        '55555555-5555-5555-5555-555555554002',
        '44444444-4444-4444-4444-444444444001',
        'Prints "Hello"',
        1,
        'Correct! Because Java passes reference handles by value, reassigning `sb` inside `modify()` does not redirect `greeting`.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555554003',
        '44444444-4444-4444-4444-444444444001',
        'Prints "HelloWorld"',
        0,
        'No append method was called; a new object was simply assigned to the local argument.',
        NULL
    );
END;

-- Q4.2: Mutating object via reference parameter
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444444002')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444444002',
        '22222222-2222-2222-2222-222222222204',
        'What is printed when `appendData()` executes?',
        'void appendData(StringBuilder sb) {' + CHAR(10) + '    sb.append(" Java");' + CHAR(10) + '}' + CHAR(10) + 'void run() {' + CHAR(10) + '    StringBuilder b = new StringBuilder("Learn");' + CHAR(10) + '    appendData(b);' + CHAR(10) + '    System.out.println(b);' + CHAR(10) + '}',
        'Is the method reassigning the variable, or invoking a mutating method on the existing object?',
        2
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555554004',
        '44444444-4444-4444-4444-444444444002',
        'Learn Java',
        1,
        'Correct! Calling a mutating method on the passed reference modifies the shared heap instance.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555554005',
        '44444444-4444-4444-4444-444444444002',
        'Learn',
        0,
        'Although the parameter handle is passed by value, both caller and callee point to the exact same StringBuilder instance on the heap.',
        NULL
    );
END;

-- Q4.3: Primitive passed into method
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444444003')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444444003',
        '22222222-2222-2222-2222-222222222204',
        'What will be printed for num?',
        'void doubleIt(int n) {' + CHAR(10) + '    n = n * 2;' + CHAR(10) + '}' + CHAR(10) + 'int num = 10;' + CHAR(10) + 'doubleIt(num);' + CHAR(10) + 'System.out.println(num);',
        'Remember that primitives are copied by value into method parameters.',
        3
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555554006',
        '44444444-4444-4444-4444-444444444003',
        '20',
        0,
        'Primitives are passed strictly by value. Changes to parameter n have zero effect on num.',
        '11111111-1111-1111-1111-111111111102' -- MISC_PASS_BY_REF
    ),
    (
        '55555555-5555-5555-5555-555555554007',
        '44444444-4444-4444-4444-444444444003',
        '10',
        1,
        'Correct! The caller variable remains 10.',
        NULL
    );
END;

-- Lesson 5 questions

-- Q5.1: Static main accessing instance field
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444445001')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444445001',
        '22222222-2222-2222-2222-222222222205',
        'What happens when attempting to compile this class?',
        'public class Launcher {' + CHAR(10) + '    int score = 100;' + CHAR(10) + '    public static void main(String[] args) {' + CHAR(10) + '        System.out.println(score);' + CHAR(10) + '    }' + CHAR(10) + '}',
        'Consider whether an instance of Launcher exists when the JVM invokes main().',
        1
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555555001',
        '44444444-4444-4444-4444-444444445001',
        'Prints 100',
        0,
        'The main method is static and cannot directly access non-static instance fields without an object instance.',
        '11111111-1111-1111-1111-111111111104' -- MISC_STATIC_INSTANCE
    ),
    (
        '55555555-5555-5555-5555-555555555002',
        '44444444-4444-4444-4444-444444445001',
        'Compile-time Error: Non-static field score cannot be referenced from a static context',
        1,
        'Correct! Because static methods execute without a `this` instance, non-static fields require instantiating the class first.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555555003',
        '44444444-4444-4444-4444-444444445001',
        'Prints 0',
        0,
        'The code does not compile at all.',
        NULL
    );
END;

-- Q5.2: Shared static counter across instances
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444445002')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444445002',
        '22222222-2222-2222-2222-222222222205',
        'What will be printed when a.count is displayed?',
        'class Counter {' + CHAR(10) + '    static int count = 0;' + CHAR(10) + '    Counter() { count++; }' + CHAR(10) + '}' + CHAR(10) + 'Counter a = new Counter();' + CHAR(10) + 'Counter b = new Counter();' + CHAR(10) + 'System.out.println(a.count);',
        'Is count stored in each individual instance or at the class level?',
        2
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555555004',
        '44444444-4444-4444-4444-444444445002',
        '1',
        0,
        'static fields are shared across all instances; both constructor calls incremented the single class-level variable.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555555005',
        '44444444-4444-4444-4444-444444445002',
        '2',
        1,
        'Correct! `static int count` exists once per class. Constructing `a` and then `b` increments count to 2.',
        NULL
    );
END;

-- Q5.3: Static method on null handle
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444445003')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444445003',
        '22222222-2222-2222-2222-222222222205',
        'What happens when calling a static method through a null reference?',
        'class Util {' + CHAR(10) + '    static void greet() { System.out.println("Hello"); }' + CHAR(10) + '}' + CHAR(10) + 'Util u = null;' + CHAR(10) + 'u.greet();',
        'Does the JVM use the object instance or the declared type of the reference to call static methods?',
        3
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555555006',
        '44444444-4444-4444-4444-444444445003',
        'Throws NullPointerException at runtime',
        0,
        'Static methods do not dispatch on instance handles. The compiler rewrites u.greet() directly into Util.greet().',
        '11111111-1111-1111-1111-111111111104' -- MISC_STATIC_INSTANCE
    ),
    (
        '55555555-5555-5555-5555-555555555007',
        '44444444-4444-4444-4444-444444445003',
        'Prints "Hello" without any exceptions',
        1,
        'Correct! Static method dispatch uses the compile-time type (`Util`), completely ignoring that `u` evaluates to null at runtime.',
        NULL
    );
END;

-- Lesson 6 questions

-- Q6.1: String Immutability
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444446001')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444446001',
        '22222222-2222-2222-2222-222222222206',
        'What is printed to the console?',
        'String text = "java";' + CHAR(10) + 'text.toUpperCase();' + CHAR(10) + 'System.out.println(text);',
        'Does calling toUpperCase() mutate the existing String or return a new one?',
        1
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555556001',
        '44444444-4444-4444-4444-444444446001',
        'JAVA',
        0,
        'String objects are immutable in Java! text.toUpperCase() creates a new String "JAVA", but the return value was discarded.',
        '11111111-1111-1111-1111-111111111106' -- MISC_STRING_MUTATION
    ),
    (
        '55555555-5555-5555-5555-555555556002',
        '44444444-4444-4444-4444-444444446001',
        'java',
        1,
        'Correct! Because Strings are immutable, `text` remains "java". To capture the uppercase version, you must reassign: `text = text.toUpperCase();`.',
        NULL
    );
END;

-- Q6.2: StringBuilder In-Place Mutation
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444446002')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444446002',
        '22222222-2222-2222-2222-222222222206',
        'What will be the output?',
        'StringBuilder sb = new StringBuilder("Data");' + CHAR(10) + 'sb.append("base");' + CHAR(10) + 'System.out.println(sb);',
        'Unlike String, is StringBuilder mutable?',
        2
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555556003',
        '44444444-4444-4444-4444-444444446002',
        'Database',
        1,
        'Correct! StringBuilder is designed specifically for mutable string operations without allocation overhead.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555556004',
        '44444444-4444-4444-4444-444444446002',
        'Data',
        0,
        'StringBuilder is mutable, so append() directly alters the internal character buffer.',
        NULL
    );
END;

-- Q6.3: String replace() return value
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444446003')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444446003',
        '22222222-2222-2222-2222-222222222206',
        'What will be output by this code?',
        'String word = "cat";' + CHAR(10) + 'String newWord = word.replace(''c'', ''b'');' + CHAR(10) + 'System.out.println(word + " " + newWord);',
        'Check which variable was reassigned.',
        3
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555556005',
        '44444444-4444-4444-4444-444444446003',
        'cat bat',
        1,
        'Correct! `word` remains "cat", while `newWord` holds the newly returned String "bat".',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555556006',
        '44444444-4444-4444-4444-444444446003',
        'bat bat',
        0,
        'replace() does not alter the original string in-place.',
        '11111111-1111-1111-1111-111111111106' -- MISC_STRING_MUTATION
    );
END;

-- Lesson 7 questions

-- Q7.1: Unboxing null Integer
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444447001')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444447001',
        '22222222-2222-2222-2222-222222222207',
        'What occurs when this arithmetic operation executes?',
        'Integer count = null;' + CHAR(10) + 'int total = count + 5;' + CHAR(10) + 'System.out.println(total);',
        'Think about what method call the Java compiler injects to convert Integer to int.',
        1
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555557001',
        '44444444-4444-4444-4444-444444447001',
        'Prints 5 (null treated as 0)',
        0,
        'Java does not treat null wrappers as 0! Unboxing implicitly calls count.intValue(), which throws a NullPointerException.',
        '11111111-1111-1111-1111-111111111107' -- MISC_AUTOBOX_NPE
    ),
    (
        '55555555-5555-5555-5555-555555557002',
        '44444444-4444-4444-4444-444444447001',
        'Throws NullPointerException at runtime',
        1,
        'Correct! Automatic unboxing invokes count.intValue(). Because count is null, an immediate NullPointerException is thrown.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555557003',
        '44444444-4444-4444-4444-444444447001',
        'Compilation Error',
        0,
        'Autoboxing syntax is completely valid at compile time; the failure happens at runtime.',
        NULL
    );
END;

-- Q7.2: Integer Cache Range (-128 to 127)
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444447002')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444447002',
        '22222222-2222-2222-2222-222222222207',
        'What will this comparison print?',
        'Integer a = 127; Integer b = 127;' + CHAR(10) + 'Integer c = 128; Integer d = 128;' + CHAR(10) + 'System.out.println((a == b) + " " + (c == d));',
        'Recall the Java specification rule for Integer caching between -128 and 127.',
        2
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555557004',
        '44444444-4444-4444-4444-444444447002',
        'true false',
        1,
        'Correct! Values -128 to 127 are cached by Integer.valueOf(), so a == b shares memory. 128 allocates new heap instances, so c == d is false.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555557005',
        '44444444-4444-4444-4444-444444447002',
        'true true',
        0,
        'Outside the -128 to 127 cache, Integer boxing allocates distinct objects, so == fails.',
        '11111111-1111-1111-1111-111111111101' -- MISC_EQUALS_REF
    );
END;

-- Q7.3: Boolean Wrapper in Condition
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444447003')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444447003',
        '22222222-2222-2222-2222-222222222207',
        'What happens when evaluating this if condition?',
        'Boolean flag = null;' + CHAR(10) + 'if (flag) {' + CHAR(10) + '    System.out.println("Active");' + CHAR(10) + '}',
        'The if condition requires a boolean primitive. How does the JVM convert Boolean flag to boolean?',
        3
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555557006',
        '44444444-4444-4444-4444-444444447003',
        'Throws NullPointerException',
        1,
        'Correct! The condition implicitly unboxes flag via flag.booleanValue(). With flag == null, it throws an NPE.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555557007',
        '44444444-4444-4444-4444-444444447003',
        'Evaluates as false and skips the block',
        0,
        'A null Boolean wrapper does not default to false; unboxing it throws a NullPointerException.',
        '11111111-1111-1111-1111-111111111107' -- MISC_AUTOBOX_NPE
    );
END;

-- Lesson 8 questions

-- Q8.1: Variable Shadowing vs Method Override
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444448001')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444448001',
        '22222222-2222-2222-2222-222222222208',
        'What will be printed when accessing `obj.val`?',
        'class Alpha { int val = 10; }' + CHAR(10) + 'class Beta extends Alpha { int val = 20; }' + CHAR(10) + 'Alpha obj = new Beta();' + CHAR(10) + 'System.out.println(obj.val);',
        'Do instance variables participate in dynamic polymorphic dispatch in Java?',
        1
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555558001',
        '44444444-4444-4444-4444-444444448001',
        '20',
        0,
        'Variable shadowing is not polymorphic! Fields are resolved at compile time based on the declared reference type (Alpha).',
        '11111111-1111-1111-1111-111111111108' -- MISC_POLYMORPHIC_FIELD
    ),
    (
        '55555555-5555-5555-5555-555555558002',
        '44444444-4444-4444-4444-444444448001',
        '10',
        1,
        'Correct! In Java, only instance methods are polymorphic. Fields are bound statically at compile time using the reference type (`Alpha`).',
        NULL
    );
END;

-- Q8.2: Polymorphic Method Dispatch
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444448002')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444448002',
        '22222222-2222-2222-2222-222222222208',
        'What will be printed by obj.show()?',
        'class Alpha { void show() { System.out.println("Alpha"); } }' + CHAR(10) + 'class Beta extends Alpha { void show() { System.out.println("Beta"); } }' + CHAR(10) + 'Alpha obj = new Beta();' + CHAR(10) + 'obj.show();',
        'Instance methods use runtime vtable dynamic dispatch.',
        2
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555558003',
        '44444444-4444-4444-4444-444444448002',
        'Beta',
        1,
        'Correct! Because `show()` is an instance method, Java uses runtime polymorphic dispatch to call the actual object implementation in `Beta`.',
        NULL
    ),
    (
        '55555555-5555-5555-5555-555555558004',
        '44444444-4444-4444-4444-444444448002',
        'Alpha',
        0,
        'Non-private instance methods are virtual by default in Java and dispatch to the subclass at runtime.',
        NULL
    );
END;

-- Q8.3: Static Method Hiding (Not Overriding)
IF NOT EXISTS (SELECT 1 FROM dbo.Questions WHERE Id = '44444444-4444-4444-4444-444444448003')
BEGIN
    INSERT INTO dbo.Questions (Id, LessonId, Prompt, CodeSnippet, HintText, OrderIndex)
    VALUES (
        '44444444-4444-4444-4444-444444448003',
        '22222222-2222-2222-2222-222222222208',
        'What is the output of calling a static method on a polymorphic reference?',
        'class Base { static void test() { System.out.println("Base"); } }' + CHAR(10) + 'class Sub extends Base { static void test() { System.out.println("Sub"); } }' + CHAR(10) + 'Base b = new Sub();' + CHAR(10) + 'b.test();',
        'Are static methods polymorphic in Java?',
        3
    );

    INSERT INTO dbo.QuestionOptions (Id, QuestionId, Text, IsCorrect, Explanation, AssociatedMisconceptionId)
    VALUES 
    (
        '55555555-5555-5555-5555-555555558005',
        '44444444-4444-4444-4444-444444448003',
        'Sub',
        0,
        'Static methods cannot be overridden; they are hidden. Static calls are bound at compile time based on the reference type (Base).',
        '11111111-1111-1111-1111-111111111108' -- MISC_POLYMORPHIC_FIELD
    ),
    (
        '55555555-5555-5555-5555-555555558006',
        '44444444-4444-4444-4444-444444448003',
        'Base',
        1,
        'Correct! Static methods belong to the class, not the instance. The compiler binds `b.test()` to `Base.test()`.',
        NULL
    );
END;

COMMIT TRANSACTION;
